import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AddTicketCommentDto } from './dto/add-ticket-comment.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketPriorityDto } from './dto/update-ticket-priority.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

const ticketSummaryInclude = {
  requester: {
    select: { id: true, email: true, firstName: true, lastName: true },
  },
  assignee: {
    select: { id: true, email: true, firstName: true, lastName: true },
  },
} as const;

const ticketDetailInclude = (organizationId: string) =>
  ({
    ...ticketSummaryInclude,
    machine: {
      where: { organizationId },
      select: { id: true, hostname: true },
    },
    comments: {
      where: { organizationId },
      orderBy: { createdAt: 'asc' as const },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    },
  }) as const;

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(organizationId: string) {
    return this.prisma.ticket.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: ticketSummaryInclude,
    });
  }

  async findOne(organizationId: string, ticketId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, organizationId },
      include: ticketDetailInclude(organizationId),
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found.');
    }

    return ticket;
  }

  async create(organizationId: string, requesterId: string, dto: CreateTicketDto) {
    if (dto.machineId) {
      const machine = await this.prisma.machine.findFirst({
        where: { id: dto.machineId, organizationId },
        select: { id: true },
      });

      if (!machine) {
        throw new NotFoundException('Machine not found.');
      }
    }

    return this.prisma.$transaction(async (transaction) => {
      const ticket = await transaction.ticket.create({
        data: {
          organizationId,
          requesterId,
          title: dto.title,
          description: dto.description,
          priority: dto.priority,
          category: dto.category,
          machineId: dto.machineId,
        },
        include: ticketDetailInclude(organizationId),
      });

      await transaction.auditLog.create({
        data: {
          organizationId,
          actorId: requesterId,
          action: 'ticket.created',
          entityType: 'Ticket',
          entityId: ticket.id,
        },
      });

      return ticket;
    });
  }

  async updateStatus(
    organizationId: string,
    ticketId: string,
    actorId: string,
    dto: UpdateTicketStatusDto,
  ) {
    const ticket = await this.findTicketOrThrow(organizationId, ticketId);

    return this.prisma.$transaction(async (transaction) => {
      const updatedTicket = await transaction.ticket.update({
        where: { id: ticket.id, organizationId },
        data: { status: dto.status },
        include: ticketDetailInclude(organizationId),
      });

      await transaction.auditLog.create({
        data: {
          organizationId,
          actorId,
          action: 'ticket.status_changed',
          entityType: 'Ticket',
          entityId: ticket.id,
          metadata: {
            previousStatus: ticket.status,
            status: dto.status,
          },
        },
      });

      return updatedTicket;
    });
  }

  async updatePriority(organizationId: string, ticketId: string, dto: UpdateTicketPriorityDto) {
    const ticket = await this.findTicketOrThrow(organizationId, ticketId);

    return this.prisma.ticket.update({
      where: { id: ticket.id, organizationId },
      data: { priority: dto.priority },
      include: ticketDetailInclude(organizationId),
    });
  }

  async assign(organizationId: string, ticketId: string, dto: AssignTicketDto) {
    const ticket = await this.findTicketOrThrow(organizationId, ticketId);

    if (dto.assigneeId) {
      const membership = await this.prisma.membership.findFirst({
        where: {
          organizationId,
          userId: dto.assigneeId,
          role: UserRole.TECHNICIAN,
        },
        select: { id: true },
      });

      if (!membership) {
        throw new NotFoundException('Technician not found.');
      }
    }

    return this.prisma.ticket.update({
      where: { id: ticket.id, organizationId },
      data: { assigneeId: dto.assigneeId },
      include: ticketDetailInclude(organizationId),
    });
  }

  async addComment(
    organizationId: string,
    ticketId: string,
    authorId: string,
    dto: AddTicketCommentDto,
  ) {
    await this.findTicketOrThrow(organizationId, ticketId);

    return this.prisma.$transaction(async (transaction) => {
      const comment = await transaction.ticketComment.create({
        data: {
          organizationId,
          ticketId,
          authorId,
          body: dto.body,
          isInternal: dto.isInternal,
        },
        include: {
          author: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      });

      await transaction.auditLog.create({
        data: {
          organizationId,
          actorId: authorId,
          action: 'ticket.comment_added',
          entityType: 'Ticket',
          entityId: ticketId,
          metadata: { commentId: comment.id },
        },
      });

      return comment;
    });
  }

  private async findTicketOrThrow(organizationId: string, ticketId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, organizationId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found.');
    }

    return ticket;
  }
}
