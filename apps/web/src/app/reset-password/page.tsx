'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { authApi } from '../../lib/auth-api';

export default function ResetPasswordPage(): React.ReactElement {
  const [token, setToken] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') ?? '');
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await authApi.resetPassword(token, String(form.get('password')));
      setIsComplete(true);
    } catch {
      setError('Le lien de récupération est invalide ou expiré.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-6">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-semibold text-signal">Teeket</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">Nouveau mot de passe</h1>
        {isComplete ? (
          <Link className="mt-5 block text-sm font-semibold text-signal" href="/login">
            Mot de passe modifié. Se connecter.
          </Link>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              minLength={12}
              name="password"
              placeholder="12 caractères minimum"
              required
              type="password"
            />
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button className="w-full rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-white">
              Modifier le mot de passe
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
