import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { hashPassword, verifyPassword } from './password';
import { createAccessToken, createOpaqueToken, hashOpaqueToken } from './token';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

const userInclude = {
  memberships: {
    select: {
      organizationId: true,
      role: true,
      organization: { select: { id: true, name: true, slug: true } },
    },
  },
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: userInclude,
    });

    if (
      !user?.passwordHash ||
      !user.isActive ||
      !(await verifyPassword(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.createSession(user);
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashOpaqueToken(refreshToken) },
      include: { user: { include: userInclude } },
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date() ||
      !storedToken.user.isActive
    ) {
      throw new UnauthorizedException('Refresh token is invalid.');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return this.createSession(storedToken.user);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashOpaqueToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: { id: true, isActive: true },
    });
    const message = 'If the account exists, a reset link has been prepared.';

    if (!user?.isActive) {
      return { message };
    }

    const token = createOpaqueToken();
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashOpaqueToken(token),
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
      },
    });

    return this.config.get<string>('NODE_ENV') === 'development'
      ? { message, resetToken: token }
      : { message };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const storedToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashOpaqueToken(dto.token) },
    });

    if (!storedToken || storedToken.usedAt || storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedException('Password reset token is invalid.');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: storedToken.userId },
        data: { passwordHash: await hashPassword(dto.password) },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: storedToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  private async createSession(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    memberships: {
      organizationId: string;
      role: string;
      organization: { id: string; name: string; slug: string };
    }[];
  }) {
    const refreshToken = createOpaqueToken();
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashOpaqueToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return {
      accessToken: createAccessToken(
        user,
        this.config.getOrThrow<string>('JWT_SECRET'),
        ACCESS_TOKEN_TTL_SECONDS,
      ),
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        memberships: user.memberships,
      },
    };
  }
}
