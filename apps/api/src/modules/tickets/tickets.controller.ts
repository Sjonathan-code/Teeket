import { Controller, Get } from '@nestjs/common';
import { CurrentTenant } from '../../security/decorators/current-tenant.decorator';
import { TenantScoped } from '../../security/decorators/tenant-scoped.decorator';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@TenantScoped()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@CurrentTenant() organizationId: string): ReturnType<TicketsService['findAll']> {
    return this.ticketsService.findAll(organizationId);
  }
}
