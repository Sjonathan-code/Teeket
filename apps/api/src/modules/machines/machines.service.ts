import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MachinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(organizationId: string) {
    return this.prisma.machine.findMany({
      where: { organizationId },
      orderBy: { hostname: 'asc' },
    });
  }
}
