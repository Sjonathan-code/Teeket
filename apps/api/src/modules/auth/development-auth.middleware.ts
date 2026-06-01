import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from '../../security/authenticated-request';

@Injectable()
export class DevelopmentAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async use(request: AuthenticatedRequest, _response: Response, next: NextFunction): Promise<void> {
    if (this.config.get<string>('NODE_ENV') !== 'development' || request.user) {
      next();
      return;
    }

    const userId = request.header('x-demo-user-id');
    if (!userId) {
      next();
      return;
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, isActive: true },
      select: { id: true, email: true },
    });

    if (user) {
      request.user = user;
    }

    next();
  }
}
