import { NotFoundException } from '@nestjs/common';
import { TicketStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketsService } from './tickets.service';

describe('TicketsService', () => {
  const createService = (overrides: Record<string, unknown> = {}) => {
    const prisma = {
      ticket: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      machine: {
        findFirst: jest.fn(),
      },
      membership: {
        findFirst: jest.fn(),
      },
      ticketComment: {
        create: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      ...overrides,
    };

    return {
      prisma,
      service: new TicketsService(prisma as unknown as PrismaService),
    };
  };

  it('filters the ticket list by organization', async () => {
    const { prisma, service } = createService();
    prisma.ticket.findMany.mockResolvedValue([]);

    await service.findAll('organization-a');

    expect(prisma.ticket.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: 'organization-a' } }),
    );
  });

  it('does not return a ticket from another organization', async () => {
    const { prisma, service } = createService();
    prisma.ticket.findFirst.mockResolvedValue(null);

    await expect(service.findOne('organization-a', 'ticket-b')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.ticket.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ticket-b', organizationId: 'organization-a' },
      }),
    );
  });

  it('creates a ticket and its audit log in one transaction', async () => {
    const { prisma, service } = createService();
    prisma.machine.findFirst.mockResolvedValue({ id: 'machine-a' });
    prisma.ticket.create.mockResolvedValue({ id: 'ticket-a' });
    prisma.auditLog.create.mockResolvedValue({ id: 'audit-a' });
    Object.assign(prisma, {
      $transaction: jest.fn((callback) => callback(prisma)),
    });

    await service.create('organization-a', 'user-a', {
      title: 'VPN inaccessible',
      description: 'Le client ne peut plus se connecter.',
      machineId: 'machine-a',
    });

    expect(prisma.machine.findFirst).toHaveBeenCalledWith({
      where: { id: 'machine-a', organizationId: 'organization-a' },
      select: { id: true },
    });
    expect(prisma.ticket.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          organizationId: 'organization-a',
          requesterId: 'user-a',
        }),
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        organizationId: 'organization-a',
        actorId: 'user-a',
        action: 'ticket.created',
        entityType: 'Ticket',
        entityId: 'ticket-a',
      },
    });
  });

  it('audits a status change with its previous value', async () => {
    const { prisma, service } = createService();
    prisma.ticket.findFirst.mockResolvedValue({ id: 'ticket-a', status: TicketStatus.OPEN });
    prisma.ticket.update.mockResolvedValue({ id: 'ticket-a', status: TicketStatus.RESOLVED });
    prisma.auditLog.create.mockResolvedValue({ id: 'audit-a' });
    Object.assign(prisma, {
      $transaction: jest.fn((callback) => callback(prisma)),
    });

    await service.updateStatus('organization-a', 'ticket-a', 'tech-a', {
      status: TicketStatus.RESOLVED,
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        organizationId: 'organization-a',
        actorId: 'tech-a',
        action: 'ticket.status_changed',
        entityType: 'Ticket',
        entityId: 'ticket-a',
        metadata: {
          previousStatus: TicketStatus.OPEN,
          status: TicketStatus.RESOLVED,
        },
      },
    });
  });

  it('requires an assignee to be a technician in the current organization', async () => {
    const { prisma, service } = createService();
    prisma.ticket.findFirst.mockResolvedValue({ id: 'ticket-a' });
    prisma.membership.findFirst.mockResolvedValue(null);

    await expect(
      service.assign('organization-a', 'ticket-a', { assigneeId: 'user-b' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.membership.findFirst).toHaveBeenCalledWith({
      where: {
        organizationId: 'organization-a',
        userId: 'user-b',
        role: UserRole.TECHNICIAN,
      },
      select: { id: true },
    });
  });

  it('adds a tenant-scoped comment and an audit log in one transaction', async () => {
    const { prisma, service } = createService();
    prisma.ticket.findFirst.mockResolvedValue({ id: 'ticket-a' });
    prisma.ticketComment.create.mockResolvedValue({ id: 'comment-a' });
    prisma.auditLog.create.mockResolvedValue({ id: 'audit-a' });
    Object.assign(prisma, {
      $transaction: jest.fn((callback) => callback(prisma)),
    });

    await service.addComment('organization-a', 'ticket-a', 'tech-a', {
      body: 'Je prends en charge.',
    });

    expect(prisma.ticketComment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          organizationId: 'organization-a',
          ticketId: 'ticket-a',
          authorId: 'tech-a',
          body: 'Je prends en charge.',
          isInternal: undefined,
        },
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        organizationId: 'organization-a',
        actorId: 'tech-a',
        action: 'ticket.comment_added',
        entityType: 'Ticket',
        entityId: 'ticket-a',
        metadata: { commentId: 'comment-a' },
      },
    });
  });
});
