import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(organizationId: string) {
    return this.prisma.ticket.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
