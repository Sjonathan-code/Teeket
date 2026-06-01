'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, storeSession } from '../../lib/auth-api';

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(undefined);
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const session = await authApi.login(String(form.get('email')), String(form.get('password')));
      storeSession(session);
      router.push('/tickets');
    } catch {
      setError('Connexion impossible. Vérifiez votre adresse e-mail et votre mot de passe.');
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-6">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-semibold text-signal">Teeket</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">Connexion</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Accédez à l’espace support de votre organisation.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Adresse e-mail
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-signal focus:ring-2 focus:ring-blue-100"
              defaultValue="admin@acme-demo.test"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Mot de passe
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-signal focus:ring-2 focus:ring-blue-100"
              defaultValue="TeeketDemo123!"
              name="password"
              required
              type="password"
            />
          </label>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            className="w-full rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
          <Link
            className="block text-center text-xs font-semibold text-signal"
            href="/forgot-password"
          >
            Mot de passe oublié ?
          </Link>
        </form>
      </section>
    </main>
  );
}
