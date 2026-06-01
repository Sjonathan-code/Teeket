'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { authApi } from '../../lib/auth-api';

export default function ForgotPasswordPage(): React.ReactElement {
  const [message, setMessage] = useState<string>();
  const [resetToken, setResetToken] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await authApi.forgotPassword(String(form.get('email')));
    setMessage(response.message);
    setResetToken(response.resetToken);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-6">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-semibold text-signal">Teeket</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">Mot de passe oublié</h1>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            defaultValue="admin@acme-demo.test"
            name="email"
            required
            type="email"
          />
          <button className="w-full rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-white">
            Préparer la récupération
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        {resetToken && (
          <Link
            className="mt-4 block break-all rounded-lg bg-blue-50 p-3 text-xs font-semibold text-signal"
            href={`/reset-password?token=${resetToken}`}
          >
            Réinitialiser le mot de passe en mode développement
          </Link>
        )}
        <Link className="mt-5 block text-center text-xs font-semibold text-signal" href="/login">
          Retour à la connexion
        </Link>
      </section>
    </main>
  );
}
