import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

/**
 * IMPORTANT:
 * Prisma seed scripts MUST use an async main()
 * Top-level await is NOT allowed in CommonJS.
 */
async function main() {
  console.log('🌱 Seeding Ignite-Agent database...');

  const tenantId = '00000000-0000-0000-0000-000000000001';

  // -----------------------------
  // TENANT
  // -----------------------------
  await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: 'Ignite Demo Tenant',
      status: 'ACTIVE',
      settingsJson: {
        environment: 'local',
      },
    },
  });

  // -----------------------------
  // USERS
  // -----------------------------
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId,
        email: 'client@acme.com',
      },
    },
    update: {},
    create: {
      id: randomUUID(),
      tenantId,
      email: 'client@acme.com',
      name: 'ACME Client',
      password: passwordHash,
      status: 'ACTIVE',
    },
  });

  // -----------------------------
  // TEAMS
  // -----------------------------
  const teams = [
    'HR',
    'Finance',
    'Marketing',
    'Backend',
    'Frontend',
    'Full-Stack',
    'DevOps',
    'CI/CD',
    'MuleSoft',
    'AWS',
    'Cybersecurity',
  ];

  for (const name of teams) {
    await prisma.team.upsert({
      where: {
        tenantId_name: { tenantId, name },
      },
      update: {},
      create: {
        id: randomUUID(),
        tenantId,
        name,
        description: `${name} team`,
        visibility: 'CLIENT',
      },
    });
  }

  console.log('✅ Seed completed successfully.');
}

/**
 * Run + cleanup
 */
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
