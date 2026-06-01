import { UserRole } from './enums';

export interface AuthenticatedUser {
  id: string;
  email: string;
  organizationId?: string;
  roles: UserRole[];
}

export interface TenantContext {
  organizationId: string;
}

export interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}
