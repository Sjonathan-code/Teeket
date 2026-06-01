import { labels, TicketPriority, TicketStatus } from '../lib/tickets-api';

const statusStyles: Record<TicketStatus, string> = {
  OPEN: 'bg-blue-50 text-blue-700',
  IN_PROGRESS: 'bg-amber-50 text-amber-700',
  WAITING_FOR_USER: 'bg-violet-50 text-violet-700',
  RESOLVED: 'bg-emerald-50 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-600',
};

const priorityStyles: Record<TicketPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-blue-50 text-blue-700',
  HIGH: 'bg-orange-50 text-orange-700',
  CRITICAL: 'bg-red-50 text-red-700',
};

interface TicketBadgeProps {
  kind: 'status' | 'priority';
  value: TicketStatus | TicketPriority;
}

export function TicketBadge({ kind, value }: TicketBadgeProps): React.ReactElement {
  const styles =
    kind === 'status'
      ? statusStyles[value as TicketStatus]
      : priorityStyles[value as TicketPriority];
  const label =
    kind === 'status'
      ? labels.status[value as TicketStatus]
      : labels.priority[value as TicketPriority];

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>{label}</span>
  );
}
