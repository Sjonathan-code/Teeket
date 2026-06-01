const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

interface Membership {
  organizationId: string;
  role: string;
  organization: { id: string; name: string; slug: string };
}

interface Session {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    memberships: Membership[];
  };
}

async function authFetch<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

  if (!response.ok) {
    throw new Error(`L'API a répondu avec le statut ${response.status}.`);
  }

  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

export const authApi = {
  login: (email: string, password: string): Promise<Session> =>
    authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: (): Promise<void> => authFetch('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string): Promise<{ message: string; resetToken?: string }> =>
    authFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string): Promise<void> =>
    authFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

export function storeSession(session: Session): void {
  const organizationId = session.user.memberships[0]?.organizationId;
  if (!organizationId) {
    throw new Error('Votre compte ne possède aucune organisation.');
  }

  setAccessToken(session.accessToken);
  window.localStorage.setItem('teeket_organization_id', organizationId);
}

export function clearSession(): void {
  setAccessToken(undefined);
  window.localStorage.removeItem('teeket_organization_id');
}
import { setAccessToken } from './api-client';
