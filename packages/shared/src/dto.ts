import { TicketCategory, TicketPriority } from './enums';

export interface CreateTicketDto {
  title: string;
  description: string;
  priority?: TicketPriority;
  category?: TicketCategory;
  machineId?: string;
}
