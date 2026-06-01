'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, clearSession } from '../lib/auth-api';

const links = [
  { href: '/dashboard', label: 'Vue d’ensemble' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/machines', label: 'Machines' },
];

export function AppSidebar(): React.ReactElement {
  const router = useRouter();

  async function logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      clearSession();
      router.push('/login');
    }
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white px-5 py-6">
      <Link className="text-xl font-bold tracking-tight text-ink" href="/dashboard">
        Teeket
      </Link>
      <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
        Support IT
      </p>

      <nav className="mt-10 space-y-1">
        {links.map((link) => (
          <Link
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-signal"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        className="mt-auto rounded-lg bg-slate-50 px-3 py-3 text-left text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-ink"
        onClick={() => void logout()}
        type="button"
      >
        Se déconnecter
      </button>
    </aside>
  );
}
