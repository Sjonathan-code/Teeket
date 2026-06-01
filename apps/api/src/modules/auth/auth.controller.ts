import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Public } from '../../security/decorators/public.decorator';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const REFRESH_TOKEN_COOKIE = 'teeket_refresh_token';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @Public()
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.login(dto);
    this.setRefreshToken(response, session.refreshToken);

    return { accessToken: session.accessToken, user: session.user };
  }

  @Post('refresh')
  @HttpCode(200)
  @Public()
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.refresh(this.getRefreshToken(request));
    this.setRefreshToken(response, session.refreshToken);

    return { accessToken: session.accessToken, user: session.user };
  }

  @Post('logout')
  @HttpCode(204)
  @Public()
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(this.getRefreshToken(request));
    response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/api/auth' });
  }

  @Post('forgot-password')
  @HttpCode(200)
  @Public()
  forgotPassword(@Body() dto: ForgotPasswordDto): ReturnType<AuthService['forgotPassword']> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(204)
  @Public()
  resetPassword(@Body() dto: ResetPasswordDto): ReturnType<AuthService['resetPassword']> {
    return this.authService.resetPassword(dto);
  }

  private getRefreshToken(request: Request): string | undefined {
    return request.headers.cookie
      ?.split(';')
      .map((cookie) => cookie.trim().split('='))
      .find(([name]) => name === REFRESH_TOKEN_COOKIE)?.[1];
  }

  private setRefreshToken(response: Response, refreshToken: string): void {
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_TTL_MS,
      path: '/api/auth',
      sameSite: 'strict',
      secure: this.config.get<string>('NODE_ENV') === 'production',
    });
  }
}
