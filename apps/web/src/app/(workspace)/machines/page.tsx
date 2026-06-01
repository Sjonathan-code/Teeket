'use client';

import { useEffect, useState } from 'react';
import { PageHeading } from '../../../components/page-heading';
import {
  Machine,
  machinesApi,
  machineStatusLabels,
  machineStatusStyles,
} from '../../../lib/machines-api';

export default function MachinesPage(): React.ReactElement {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    machinesApi
      .list()
      .then(setMachines)
      .catch((caughtError: unknown) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Impossible de charger les machines.',
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <PageHeading
        description="Visualisez l’état des postes et les informations remontées par l’agent Teeket."
        eyebrow="Inventaire"
        title="Machines"
      />

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading && (
          <p className="px-6 py-10 text-sm text-slate-500">Chargement des machines...</p>
        )}
        {error && <p className="px-6 py-10 text-sm font-medium text-red-600">{error}</p>}
        {!isLoading && !error && machines.length === 0 && (
          <p className="px-6 py-10 text-sm text-slate-500">
            Aucune machine pour cette organisation.
          </p>
        )}
        {machines.length > 0 && (
          <div className="divide-y divide-slate-100">
            {machines.map((machine) => (
              <article
                className="grid gap-3 px-6 py-5 md:grid-cols-[1fr_auto] md:items-center"
                key={machine.id}
              >
                <div>
                  <p className="font-semibold text-ink">{machine.hostname}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {machine.operatingSystem ?? 'Système non renseigné'}
                    {machine.agentVersion ? ` · agent ${machine.agentVersion}` : ''}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${machineStatusStyles[machine.status]}`}
                >
                  {machineStatusLabels[machine.status]}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
