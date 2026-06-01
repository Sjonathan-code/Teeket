import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from '../../security/authenticated-request';
import { verifyAccessToken } from './token';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async use(request: AuthenticatedRequest, _response: Response, next: NextFunction): Promise<void> {
    const authorization = request.header('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

    if (!token) {
      next();
      return;
    }

    const payload = verifyAccessToken(token, this.config.getOrThrow<string>('JWT_SECRET'));
    if (!payload) {
      next();
      return;
    }

    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, email: payload.email, isActive: true },
      select: { id: true, email: true },
    });

    if (user) {
      request.user = user;
    }

    next();
  }
}
