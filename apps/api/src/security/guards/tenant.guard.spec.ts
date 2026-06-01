import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from '../authenticated-request';
import { TenantGuard } from './tenant.guard';

describe('TenantGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(true),
  } as unknown as Reflector;

  const createContext = (request: Partial<AuthenticatedRequest>): ExecutionContext =>
    ({
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as unknown as ExecutionContext;

  it('sets the tenant context when the user belongs to the organization', async () => {
    const prisma = {
      membership: {
        findMany: jest.fn().mockResolvedValue([{ role: UserRole.TECHNICIAN }]),
      },
    } as unknown as PrismaService;
    const request = {
      header: jest.fn().mockReturnValue('organization-a'),
      user: { id: 'user-a', email: 'tech@example.test' },
    } as unknown as AuthenticatedRequest;

    await expect(
      new TenantGuard(reflector, prisma).canActivate(createContext(request)),
    ).resolves.toBe(true);
    expect(request.tenant).toEqual({
      organizationId: 'organization-a',
      roles: [UserRole.TECHNICIAN],
    });
  });

  it('rejects access to an organization without membership', async () => {
    const prisma = {
      membership: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    } as unknown as PrismaService;
    const request = {
      header: jest.fn().mockReturnValue('organization-b'),
      user: { id: 'user-a', email: 'tech@example.test' },
    } as unknown as AuthenticatedRequest;

    await expect(
      new TenantGuard(reflector, prisma).canActivate(createContext(request)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
