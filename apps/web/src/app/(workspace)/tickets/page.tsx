'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHeading } from '../../../components/page-heading';
import { TicketBadge } from '../../../components/ticket-badge';
import { labels, ticketsApi, TicketSummary, userName } from '../../../lib/tickets-api';

export default function TicketsPage(): React.ReactElement {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ticketsApi
      .list()
      .then(setTickets)
      .catch((caughtError: unknown) => {
        setError(
          caughtError instanceof Error ? caughtError.message : 'Impossible de charger les tickets.',
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <PageHeading
          description="Centralisez les demandes, attribuez-les aux techniciens et suivez leur résolution."
          eyebrow="Support"
          title="Tickets"
        />
        <Link
          className="rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          href="/tickets/new"
        >
          Créer un ticket
        </Link>
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading && (
          <p className="px-6 py-10 text-sm text-slate-500">Chargement des tickets...</p>
        )}
        {error && <p className="px-6 py-10 text-sm font-medium text-red-600">{error}</p>}
        {!isLoading && !error && tickets.length === 0 && (
          <p className="px-6 py-10 text-sm text-slate-500">Aucun ticket pour cette organisation.</p>
        )}
        {tickets.length > 0 && (
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <Link
                className="grid gap-3 px-6 py-5 transition hover:bg-slate-50 md:grid-cols-[1fr_auto] md:items-center"
                href={`/tickets/${ticket.id}`}
                key={ticket.id}
              >
                <div>
                  <p className="font-semibold text-ink">{ticket.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {labels.category[ticket.category]} · demandé par {userName(ticket.requester)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TicketBadge kind="priority" value={ticket.priority} />
                  <TicketBadge kind="status" value={ticket.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
