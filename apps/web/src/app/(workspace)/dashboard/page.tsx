import { PageHeading } from '../../../components/page-heading';

const stats = [
  { label: 'Tickets ouverts', value: '12' },
  { label: 'Machines suivies', value: '84' },
  { label: 'Incidents critiques', value: '2' },
];

export default function DashboardPage(): React.ReactElement {
  return (
    <>
      <PageHeading
        description="Suivez l’activité support, l’état du parc et les actions prioritaires de votre organisation."
        eyebrow="Tableau de bord"
        title="Bonjour, équipe IT"
      />

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            key={stat.label}
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-ink">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-ink">Activité récente</h2>
        <p className="mt-2 text-sm text-slate-500">
          Les prochains écrans connecteront ce tableau de bord à l’API Teeket.
        </p>
      </section>
    </>
  );
}
