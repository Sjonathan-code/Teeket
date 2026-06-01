import { PageHeading } from '../../../components/page-heading';

export default function MachinesPage(): React.ReactElement {
  return (
    <>
      <PageHeading
        description="Visualisez l’état des postes et les informations remontées par l’agent Teeket."
        eyebrow="Inventaire"
        title="Machines"
      />
      <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-600">
          L’inventaire des machines sera affiché ici.
        </p>
      </section>
    </>
  );
}
