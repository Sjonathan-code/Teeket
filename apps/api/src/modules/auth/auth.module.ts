import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccessTokenMiddleware } from './access-token.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AccessTokenMiddleware, AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AccessTokenMiddleware).forRoutes('{*path}');
  }
}
