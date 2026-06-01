import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from '../authenticated-request';
import { TENANT_SCOPED_KEY } from '../decorators/tenant-scoped.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isTenantScoped = this.reflector.getAllAndOverride<boolean>(TENANT_SCOPED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isTenantScoped) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const organizationId = request.header('x-organization-id');

    if (!organizationId) {
      throw new BadRequestException('The x-organization-id header is required.');
    }

    const isSuperAdmin = request.user?.platformRoles?.includes(UserRole.SUPER_ADMIN) ?? false;
    const memberships = isSuperAdmin
      ? []
      : await this.prisma.membership.findMany({
          where: {
            organizationId,
            userId: request.user?.id,
          },
          select: { role: true },
        });

    if (!isSuperAdmin && memberships.length === 0) {
      throw new ForbiddenException('The current user cannot access this organization.');
    }

    request.tenant = {
      organizationId,
      roles: isSuperAdmin ? [UserRole.SUPER_ADMIN] : memberships.map(({ role }) => role),
    };

    return true;
  }
}
