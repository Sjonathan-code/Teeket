export const ticketStatuses = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_FOR_USER',
  'RESOLVED',
  'CLOSED',
] as const;
export const ticketPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export const ticketCategories = [
  'HARDWARE',
  'SOFTWARE',
  'NETWORK',
  'ACCESS',
  'SECURITY',
  'OTHER',
] as const;

export type TicketStatus = (typeof ticketStatuses)[number];
export type TicketPriority = (typeof ticketPriorities)[number];
export type TicketCategory = (typeof ticketCategories)[number];

interface TicketUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface TicketComment {
  id: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
  author: TicketUser;
}

export interface TicketSummary {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  requester: TicketUser;
  assignee: TicketUser | null;
}

export interface TicketDetail extends TicketSummary {
  machine: { id: string; hostname: string } | null;
  comments: TicketComment[];
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
}

export const ticketsApi = {
  list: (): Promise<TicketSummary[]> => apiFetch('/tickets'),
  get: (ticketId: string): Promise<TicketDetail> => apiFetch(`/tickets/${ticketId}`),
  create: (input: CreateTicketInput): Promise<TicketDetail> =>
    apiFetch('/tickets', { method: 'POST', body: JSON.stringify(input) }),
  updateStatus: (ticketId: string, status: TicketStatus): Promise<TicketDetail> =>
    apiFetch(`/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  addComment: (ticketId: string, body: string): Promise<TicketComment> =>
    apiFetch(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),
};

export const labels = {
  category: {
    HARDWARE: 'Matériel',
    SOFTWARE: 'Logiciel',
    NETWORK: 'Réseau',
    ACCESS: 'Accès',
    SECURITY: 'Sécurité',
    OTHER: 'Autre',
  },
  priority: {
    LOW: 'Basse',
    MEDIUM: 'Moyenne',
    HIGH: 'Haute',
    CRITICAL: 'Critique',
  },
  status: {
    OPEN: 'Ouvert',
    IN_PROGRESS: 'En cours',
    WAITING_FOR_USER: 'En attente utilisateur',
    RESOLVED: 'Résolu',
    CLOSED: 'Fermé',
  },
} as const;

export function userName(user: TicketUser): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
}
import { apiFetch } from './api-client';
