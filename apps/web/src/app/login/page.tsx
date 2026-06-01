export default function LoginPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-6">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-semibold text-signal">Teeket</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">Connexion</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          L’authentification sera branchée lors de la prochaine étape du MVP.
        </p>

        <form className="mt-7 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Adresse e-mail
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-signal focus:ring-2 focus:ring-blue-100"
              disabled
              placeholder="vous@entreprise.fr"
              type="email"
            />
          </label>
          <button
            className="w-full rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-white opacity-60"
            disabled
            type="button"
          >
            Se connecter
          </button>
        </form>
      </section>
    </main>
  );
}
