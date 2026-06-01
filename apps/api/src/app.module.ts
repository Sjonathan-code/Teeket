import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AiModule } from './modules/ai/ai.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { MachinesModule } from './modules/machines/machines.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PlaybooksModule } from './modules/playbooks/playbooks.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthGuard } from './security/guards/auth.guard';
import { RolesGuard } from './security/guards/roles.guard';
import { TenantGuard } from './security/guards/tenant.guard';
import { validateEnvironment } from './config/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env', '.env'],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    TicketsModule,
    MachinesModule,
    KnowledgeBaseModule,
    AiModule,
    PlaybooksModule,
    AuditLogsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
