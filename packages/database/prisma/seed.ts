import { PrismaClient, TicketCategory, TicketPriority, UserRole } from '@prisma/client';
import { randomBytes, scryptSync } from 'node:crypto';

const prisma = new PrismaClient();
const demoPassword = 'TeeketDemo123!';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64);

  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function main(): Promise<void> {
  const organization = await prisma.organization.upsert({
    where: { slug: 'acme-demo' },
    update: {},
    create: {
      name: 'Acme Demo',
      slug: 'acme-demo',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@acme-demo.test' },
    update: { passwordHash: hashPassword(demoPassword) },
    create: {
      email: 'admin@acme-demo.test',
      firstName: 'Alex',
      lastName: 'Admin',
      passwordHash: hashPassword(demoPassword),
    },
  });

  await prisma.membership.upsert({
    where: {
      organizationId_userId_role: {
        organizationId: organization.id,
        userId: admin.id,
        role: UserRole.ORG_ADMIN,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: admin.id,
      role: UserRole.ORG_ADMIN,
    },
  });

  const machine = await prisma.machine.upsert({
    where: {
      organizationId_hostname: {
        organizationId: organization.id,
        hostname: 'ACME-LAPTOP-001',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      hostname: 'ACME-LAPTOP-001',
      operatingSystem: 'Windows 11 Pro',
    },
  });

  const existingTicket = await prisma.ticket.findFirst({
    where: {
      organizationId: organization.id,
      title: 'Impossible de se connecter au VPN',
    },
  });

  if (!existingTicket) {
    await prisma.ticket.create({
      data: {
        organizationId: organization.id,
        requesterId: admin.id,
        machineId: machine.id,
        title: 'Impossible de se connecter au VPN',
        description: 'Le client VPN affiche une erreur de connexion depuis ce matin.',
        priority: TicketPriority.MEDIUM,
        category: TicketCategory.NETWORK,
      },
    });
  }

  console.log(`Seeded development organization: ${organization.slug} (${organization.id})`);
  console.log(`Seeded development user: ${admin.email} (${admin.id})`);
  console.log(`Seeded development password: ${demoPassword}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
