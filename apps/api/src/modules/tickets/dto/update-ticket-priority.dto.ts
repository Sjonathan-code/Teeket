import { TicketPriority } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateTicketPriorityDto {
  @IsEnum(TicketPriority)
  priority!: TicketPriority;
}
