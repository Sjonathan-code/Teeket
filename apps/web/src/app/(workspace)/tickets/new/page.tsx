'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { PageHeading } from '../../../../components/page-heading';
import {
  labels,
  ticketCategories,
  ticketPriorities,
  ticketsApi,
  TicketCategory,
  TicketPriority,
} from '../../../../lib/tickets-api';

export default function NewTicketPage(): React.ReactElement {
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setError(undefined);

    const form = new FormData(event.currentTarget);

    try {
      const ticket = await ticketsApi.create({
        title: String(form.get('title')),
        description: String(form.get('description')),
        priority: String(form.get('priority')) as TicketPriority,
        category: String(form.get('category')) as TicketCategory,
      });
      setCreatedTicketId(ticket.id);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error ? caughtError.message : 'Impossible de créer le ticket.',
      );
      setIsSubmitting(false);
    }
  }

  if (createdTicketId) {
    return (
      <>
        <PageHeading
          description="Votre demande a bien été transmise à l’équipe support."
          eyebrow="Support"
          title="Ticket créé"
        />
        <section className="mt-8 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-medium text-emerald-800">
            Référence du ticket : {createdTicketId}
          </p>
          <button
            className="mt-5 inline-block rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-white"
            onClick={() => setCreatedTicketId(undefined)}
            type="button"
          >
            Créer un autre ticket
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeading
        description="Décrivez votre demande afin que l’équipe support puisse la prendre en charge."
        eyebrow="Support"
        title="Nouveau ticket"
      />

      <form
        className="mt-8 max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <label className="block text-sm font-medium text-slate-700">
          Titre
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-signal focus:ring-2 focus:ring-blue-100"
            maxLength={160}
            minLength={3}
            name="title"
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            className="mt-2 min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-signal focus:ring-2 focus:ring-blue-100"
            maxLength={5000}
            minLength={3}
            name="description"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Priorité
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              defaultValue="MEDIUM"
              name="priority"
            >
              {ticketPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {labels.priority[priority]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Catégorie
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              defaultValue="OTHER"
              name="category"
            >
              {ticketCategories.map((category) => (
                <option key={category} value={category}>
                  {labels.category[category]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            className="rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Création...' : 'Créer le ticket'}
          </button>
          <Link className="text-sm font-semibold text-slate-500 hover:text-ink" href="/tickets">
            Annuler
          </Link>
        </div>
      </form>
    </>
  );
}
