import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentTenant } from '../../security/decorators/current-tenant.decorator';
import { CurrentUser } from '../../security/decorators/current-user.decorator';
import { Roles } from '../../security/decorators/roles.decorator';
import { TenantScoped } from '../../security/decorators/tenant-scoped.decorator';
import { RequestUser } from '../../security/authenticated-request';
import { AddTicketCommentDto } from './dto/add-ticket-comment.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketPriorityDto } from './dto/update-ticket-priority.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@TenantScoped()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @Roles(UserRole.ORG_ADMIN, UserRole.TECHNICIAN)
  findAll(@CurrentTenant() organizationId: string): ReturnType<TicketsService['findAll']> {
    return this.ticketsService.findAll(organizationId);
  }

  @Post()
  create(
    @CurrentTenant() organizationId: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateTicketDto,
  ): ReturnType<TicketsService['create']> {
    return this.ticketsService.create(organizationId, user.id, dto);
  }

  @Get(':ticketId')
  @Roles(UserRole.ORG_ADMIN, UserRole.TECHNICIAN)
  findOne(
    @CurrentTenant() organizationId: string,
    @Param('ticketId') ticketId: string,
  ): ReturnType<TicketsService['findOne']> {
    return this.ticketsService.findOne(organizationId, ticketId);
  }

  @Patch(':ticketId/status')
  @Roles(UserRole.ORG_ADMIN, UserRole.TECHNICIAN)
  updateStatus(
    @CurrentTenant() organizationId: string,
    @CurrentUser() user: RequestUser,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketStatusDto,
  ): ReturnType<TicketsService['updateStatus']> {
    return this.ticketsService.updateStatus(organizationId, ticketId, user.id, dto);
  }

  @Patch(':ticketId/priority')
  @Roles(UserRole.ORG_ADMIN, UserRole.TECHNICIAN)
  updatePriority(
    @CurrentTenant() organizationId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketPriorityDto,
  ): ReturnType<TicketsService['updatePriority']> {
    return this.ticketsService.updatePriority(organizationId, ticketId, dto);
  }

  @Patch(':ticketId/assignee')
  @Roles(UserRole.ORG_ADMIN, UserRole.TECHNICIAN)
  assign(
    @CurrentTenant() organizationId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: AssignTicketDto,
  ): ReturnType<TicketsService['assign']> {
    return this.ticketsService.assign(organizationId, ticketId, dto);
  }

  @Post(':ticketId/comments')
  @Roles(UserRole.ORG_ADMIN, UserRole.TECHNICIAN)
  addComment(
    @CurrentTenant() organizationId: string,
    @CurrentUser() user: RequestUser,
    @Param('ticketId') ticketId: string,
    @Body() dto: AddTicketCommentDto,
  ): ReturnType<TicketsService['addComment']> {
    return this.ticketsService.addComment(organizationId, ticketId, user.id, dto);
  }
}
