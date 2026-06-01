import { IsUUID, ValidateIf } from 'class-validator';

export class AssignTicketDto {
  @ValidateIf((_object, value: unknown) => value !== null)
  @IsUUID()
  assigneeId!: string | null;
}
