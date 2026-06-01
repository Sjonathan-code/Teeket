import { PageHeading } from '../../../components/page-heading';

export default function TicketsPage(): React.ReactElement {
  return (
    <>
      <PageHeading
        description="Centralisez les demandes, attribuez-les aux techniciens et suivez leur résolution."
        eyebrow="Support"
        title="Tickets"
      />
      <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-600">
          La liste des tickets sera affichée ici.
        </p>
      </section>
    </>
  );
}
