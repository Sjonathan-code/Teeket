import { Controller, Get } from '@nestjs/common';
import { CurrentTenant } from '../../security/decorators/current-tenant.decorator';
import { TenantScoped } from '../../security/decorators/tenant-scoped.decorator';
import { MachinesService } from './machines.service';

@Controller('machines')
@TenantScoped()
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  findAll(@CurrentTenant() organizationId: string): ReturnType<MachinesService['findAll']> {
    return this.machinesService.findAll(organizationId);
  }
}
