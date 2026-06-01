import { SetMetadata } from '@nestjs/common';

export const TENANT_SCOPED_KEY = 'tenantScoped';
export const TenantScoped = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(TENANT_SCOPED_KEY, true);
