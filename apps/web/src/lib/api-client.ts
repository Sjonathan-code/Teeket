const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const demoUserId = process.env.NEXT_PUBLIC_DEMO_USER_ID;

  if (!organizationId) {
    throw new Error('NEXT_PUBLIC_ORGANIZATION_ID doit être configuré.');
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-organization-id': organizationId,
      ...(demoUserId ? { 'x-demo-user-id': demoUserId } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`L'API a répondu avec le statut ${response.status}.`);
  }

  return (await response.json()) as T;
}
