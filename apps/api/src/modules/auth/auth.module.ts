import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DevelopmentAuthMiddleware } from './development-auth.middleware';

@Module({
  providers: [DevelopmentAuthMiddleware],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(DevelopmentAuthMiddleware).forRoutes('{*path}');
  }
}
