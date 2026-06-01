const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
let accessToken: string | undefined;

export async function apiFetch<T>(path: string, init?: RequestInit, canRefresh = true): Promise<T> {
  const organizationId = window.localStorage.getItem('teeket_organization_id');
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(organizationId ? { 'x-organization-id': organizationId } : {}),
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 401 && canRefresh && path !== '/auth/refresh') {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, init, false);
    }
  }

  if (!response.ok) {
    throw new Error(`L'API a répondu avec le statut ${response.status}.`);
  }

  return (await response.json()) as T;
}

export function setAccessToken(token: string | undefined): void {
  accessToken = token;
}

async function refreshAccessToken(): Promise<boolean> {
  const response = await fetch(`${apiUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    setAccessToken(undefined);
    return false;
  }

  const session = (await response.json()) as { accessToken: string };
  setAccessToken(session.accessToken);

  return true;
}
