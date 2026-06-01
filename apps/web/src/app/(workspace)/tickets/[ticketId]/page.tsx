'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { PageHeading } from '../../../../components/page-heading';
import { TicketBadge } from '../../../../components/ticket-badge';
import {
  labels,
  ticketStatuses,
  ticketsApi,
  TicketDetail,
  TicketStatus,
  userName,
} from '../../../../lib/tickets-api';

export default function TicketDetailPage(): React.ReactElement {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketDetail>();
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const loadTicket = useCallback(() => {
    setError(undefined);
    ticketsApi
      .get(ticketId)
      .then(setTicket)
      .catch((caughtError: unknown) => {
        setError(
          caughtError instanceof Error ? caughtError.message : 'Impossible de charger le ticket.',
        );
      });
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  async function changeStatus(status: TicketStatus): Promise<void> {
    setIsSaving(true);
    try {
      setTicket(await ticketsApi.updateStatus(ticketId, status));
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error ? caughtError.message : 'Impossible de changer le statut.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function addComment(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSaving(true);
    const form = event.currentTarget;
    const body = String(new FormData(form).get('body'));

    try {
      await ticketsApi.addComment(ticketId, body);
      form.reset();
      loadTicket();
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error ? caughtError.message : 'Impossible d’ajouter le commentaire.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!ticket) {
    return <p className="text-sm text-slate-500">{error ?? 'Chargement du ticket...'}</p>;
  }

  return (
    <>
      <Link className="text-sm font-semibold text-signal hover:text-blue-700" href="/tickets">
        ← Retour aux tickets
      </Link>
      <div className="mt-5">
        <PageHeading
          description={`Demandé par ${userName(ticket.requester)} · ${labels.category[ticket.category]}`}
          eyebrow="Ticket"
          title={ticket.title}
        />
      </div>

      {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Description
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {ticket.description}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-ink">Commentaires</h2>
            <div className="mt-4 space-y-4">
              {ticket.comments.length === 0 && (
                <p className="text-sm text-slate-500">Aucun commentaire pour le moment.</p>
              )}
              {ticket.comments.map((comment) => (
                <article className="rounded-lg bg-slate-50 px-4 py-3" key={comment.id}>
                  <p className="text-xs font-semibold text-slate-500">{userName(comment.author)}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {comment.body}
                  </p>
                </article>
              ))}
            </div>

            <form className="mt-5" onSubmit={addComment}>
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-blue-100"
                maxLength={5000}
                name="body"
                placeholder="Ajouter un commentaire..."
                required
              />
              <button
                className="mt-3 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                Ajouter le commentaire
              </button>
            </form>
          </section>
        </div>

        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Statut</p>
            <div className="mt-2">
              <TicketBadge kind="status" value={ticket.status} />
            </div>
            <select
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              disabled={isSaving}
              onChange={(event) => void changeStatus(event.target.value as TicketStatus)}
              value={ticket.status}
            >
              {ticketStatuses.map((status) => (
                <option key={status} value={status}>
                  {labels.status[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Priorité
            </p>
            <div className="mt-2">
              <TicketBadge kind="priority" value={ticket.priority} />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Assigné à
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {ticket.assignee ? userName(ticket.assignee) : 'Non assigné'}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
