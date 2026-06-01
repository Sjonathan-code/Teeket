import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from '../../security/authenticated-request';
import { AccessTokenMiddleware } from './access-token.middleware';
import { createAccessToken } from './token';

describe('AccessTokenMiddleware', () => {
  const secret = 'test_secret_with_at_least_32_characters';
  const config = {
    getOrThrow: jest.fn().mockReturnValue(secret),
  } as unknown as ConfigService;

  it('hydrates the authenticated user from a valid bearer token', async () => {
    const token = createAccessToken({ id: 'user-a', email: 'user@example.test' }, secret, 60);
    const prisma = {
      user: {
        findFirst: jest.fn().mockResolvedValue({ id: 'user-a', email: 'user@example.test' }),
      },
    } as unknown as PrismaService;
    const request = {
      header: jest.fn().mockReturnValue(`Bearer ${token}`),
    } as unknown as AuthenticatedRequest;
    const next = jest.fn();

    await new AccessTokenMiddleware(config, prisma).use(request, {} as never, next);

    expect(request.user).toEqual({ id: 'user-a', email: 'user@example.test' });
    expect(next).toHaveBeenCalled();
  });

  it('does not hydrate the user from an invalid bearer token', async () => {
    const prisma = {
      user: {
        findFirst: jest.fn(),
      },
    } as unknown as PrismaService;
    const request = {
      header: jest.fn().mockReturnValue('Bearer invalid-token'),
    } as unknown as AuthenticatedRequest;
    const next = jest.fn();

    await new AccessTokenMiddleware(config, prisma).use(request, {} as never, next);

    expect(request.user).toBeUndefined();
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
