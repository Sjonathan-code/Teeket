import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface RequestUser {
  id: string;
  email: string;
  platformRoles?: UserRole[];
}

export interface AuthenticatedRequest extends Request {
  user?: RequestUser;
  tenant?: {
    organizationId: string;
    roles: UserRole[];
  };
}
