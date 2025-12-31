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
  console.log('🌱 Seeding Adwa-Agent database...');

  const tenantId = '00000000-0000-0000-0000-000000000001';
  const tenantId2 = '00000000-0000-0000-0000-000000000002';

  // -----------------------------
  // TENANTS
  // -----------------------------
  await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: 'Adwa Demo Tenant',
      status: 'ACTIVE',
      settingsJson: {
        environment: 'local',
      },
    },
  });

  await prisma.tenant.upsert({
    where: { id: tenantId2 },
    update: {},
    create: {
      id: tenantId2,
      name: 'Second Test Tenant',
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
  // TEAMS & CAPABILITIES (MuleWave-specific)
  // -----------------------------
  const teamsWithCapabilities = [
    {
      name: 'MuleSoft Integration',
      description: 'Expert team specializing in MuleSoft Anypoint Platform integration solutions',
      capabilities: [
        {
          capability: 'Anypoint Platform Implementation',
          slaJson: { responseTime: '4 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Integration Architect', accountable: 'Technical Lead', consulted: 'Client', informed: 'Project Manager' },
        },
        {
          capability: 'API Design & Development',
          slaJson: { responseTime: '2 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'API Developer', accountable: 'Integration Lead', consulted: 'Business Analyst', informed: 'Stakeholders' },
        },
        {
          capability: 'DataWeave Transformation',
          slaJson: { responseTime: '2 hours', resolutionTime: '1 day' },
          raciJson: { responsible: 'MuleSoft Developer', accountable: 'Integration Lead' },
        },
        {
          capability: 'Mule Runtime Configuration',
          slaJson: { responseTime: '4 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'DevOps Engineer', accountable: 'Platform Lead' },
        },
      ],
    },
    {
      name: 'API Development',
      description: 'Building scalable and secure REST APIs and microservices',
      capabilities: [
        {
          capability: 'RESTful API Design',
          slaJson: { responseTime: '4 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'API Architect', accountable: 'Technical Lead', consulted: 'Security Team' },
        },
        {
          capability: 'API Security Implementation',
          slaJson: { responseTime: '2 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Security Engineer', accountable: 'API Lead', consulted: 'Compliance' },
        },
        {
          capability: 'API Documentation',
          slaJson: { responseTime: '1 hour', resolutionTime: '1 day' },
          raciJson: { responsible: 'Technical Writer', accountable: 'API Developer' },
        },
        {
          capability: 'API Gateway Configuration',
          slaJson: { responseTime: '4 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'Platform Engineer', accountable: 'Infrastructure Lead' },
        },
      ],
    },
    {
      name: 'Cloud Solutions',
      description: 'Cloud infrastructure and integration on AWS, Azure, and GCP',
      capabilities: [
        {
          capability: 'AWS CloudHub Deployment',
          slaJson: { responseTime: '4 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'Cloud Engineer', accountable: 'Infrastructure Lead', consulted: 'MuleSoft Team' },
        },
        {
          capability: 'Azure Integration Services',
          slaJson: { responseTime: '4 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Azure Specialist', accountable: 'Cloud Lead' },
        },
        {
          capability: 'Cloud Architecture Design',
          slaJson: { responseTime: '8 hours', resolutionTime: '5 days' },
          raciJson: { responsible: 'Cloud Architect', accountable: 'CTO', consulted: 'Security Team' },
        },
        {
          capability: 'Serverless Integration',
          slaJson: { responseTime: '4 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Serverless Engineer', accountable: 'Cloud Lead' },
        },
      ],
    },
    {
      name: 'DevOps & CI/CD',
      description: 'Continuous integration, deployment, and infrastructure automation',
      capabilities: [
        {
          capability: 'CI/CD Pipeline Setup',
          slaJson: { responseTime: '4 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'DevOps Engineer', accountable: 'DevOps Lead', consulted: 'Development Teams' },
        },
        {
          capability: 'Infrastructure as Code',
          slaJson: { responseTime: '4 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'IaC Specialist', accountable: 'Infrastructure Lead' },
        },
        {
          capability: 'Container Orchestration',
          slaJson: { responseTime: '6 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Kubernetes Engineer', accountable: 'DevOps Lead' },
        },
        {
          capability: 'Monitoring & Logging',
          slaJson: { responseTime: '2 hours', resolutionTime: '1 day' },
          raciJson: { responsible: 'SRE', accountable: 'Operations Lead' },
        },
      ],
    },
    {
      name: 'Business Consulting',
      description: 'Strategic consulting for digital transformation and integration strategy',
      capabilities: [
        {
          capability: 'Integration Strategy',
          slaJson: { responseTime: '24 hours', resolutionTime: '10 days' },
          raciJson: { responsible: 'Solution Architect', accountable: 'Consulting Lead', consulted: 'Client Stakeholders' },
        },
        {
          capability: 'Business Process Analysis',
          slaJson: { responseTime: '24 hours', resolutionTime: '7 days' },
          raciJson: { responsible: 'Business Analyst', accountable: 'Consulting Lead' },
        },
        {
          capability: 'Digital Transformation Roadmap',
          slaJson: { responseTime: '48 hours', resolutionTime: '14 days' },
          raciJson: { responsible: 'Digital Consultant', accountable: 'Practice Director', consulted: 'Architects' },
        },
        {
          capability: 'ROI Analysis',
          slaJson: { responseTime: '24 hours', resolutionTime: '5 days' },
          raciJson: { responsible: 'Business Consultant', accountable: 'Consulting Lead' },
        },
      ],
    },
    {
      name: 'Quality Assurance',
      description: 'Testing and quality assurance for integrations and applications',
      capabilities: [
        {
          capability: 'Integration Testing',
          slaJson: { responseTime: '4 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'QA Engineer', accountable: 'QA Lead', consulted: 'Development Team' },
        },
        {
          capability: 'Performance Testing',
          slaJson: { responseTime: '8 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Performance Engineer', accountable: 'QA Lead' },
        },
        {
          capability: 'Security Testing',
          slaJson: { responseTime: '8 hours', resolutionTime: '4 days' },
          raciJson: { responsible: 'Security Tester', accountable: 'Security Lead', consulted: 'Compliance' },
        },
        {
          capability: 'Test Automation',
          slaJson: { responseTime: '4 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Automation Engineer', accountable: 'QA Lead' },
        },
      ],
    },
    {
      name: 'Support & Maintenance',
      description: '24/7 support and maintenance for production integrations',
      capabilities: [
        {
          capability: 'Production Support',
          slaJson: { responseTime: '15 minutes', resolutionTime: '4 hours' },
          raciJson: { responsible: 'Support Engineer', accountable: 'Support Lead', informed: 'Client' },
        },
        {
          capability: 'Incident Management',
          slaJson: { responseTime: '10 minutes', resolutionTime: '2 hours' },
          raciJson: { responsible: 'Incident Manager', accountable: 'Operations Lead', consulted: 'Technical Teams' },
        },
        {
          capability: 'Platform Upgrades',
          slaJson: { responseTime: '24 hours', resolutionTime: '5 days' },
          raciJson: { responsible: 'Platform Engineer', accountable: 'Technical Lead', consulted: 'Client' },
        },
        {
          capability: 'Health Monitoring',
          slaJson: { responseTime: '5 minutes', resolutionTime: '1 hour' },
          raciJson: { responsible: 'Monitoring Specialist', accountable: 'Operations Lead' },
        },
      ],
    },
    {
      name: 'Project Management',
      description: 'Agile project management and delivery coordination',
      capabilities: [
        {
          capability: 'Agile Project Management',
          slaJson: { responseTime: '4 hours', resolutionTime: 'ongoing' },
          raciJson: { responsible: 'Project Manager', accountable: 'Program Director', consulted: 'Stakeholders' },
        },
        {
          capability: 'Resource Planning',
          slaJson: { responseTime: '24 hours', resolutionTime: '3 days' },
          raciJson: { responsible: 'Resource Manager', accountable: 'PMO Lead' },
        },
        {
          capability: 'Risk Management',
          slaJson: { responseTime: '8 hours', resolutionTime: '2 days' },
          raciJson: { responsible: 'Risk Manager', accountable: 'Project Manager', consulted: 'Leadership' },
        },
        {
          capability: 'Stakeholder Communication',
          slaJson: { responseTime: '2 hours', resolutionTime: '1 day' },
          raciJson: { responsible: 'Project Manager', accountable: 'Program Director', informed: 'All Stakeholders' },
        },
      ],
    },
  ];

  for (const teamData of teamsWithCapabilities) {
    // Create team
    const team = await prisma.team.upsert({
      where: {
        tenantId_name: { tenantId, name: teamData.name },
      },
      update: {
        description: teamData.description,
      },
      create: {
        id: randomUUID(),
        tenantId,
        name: teamData.name,
        description: teamData.description,
        visibility: 'CLIENT',
      },
    });

    // Create team capabilities
    for (const capData of teamData.capabilities) {
      await prisma.teamCapability.upsert({
        where: {
          id: randomUUID(), // This will always create new since ID is unique
        },
        update: {},
        create: {
          id: randomUUID(),
          tenantId,
          teamId: team.id,
          capability: capData.capability,
          slaJson: capData.slaJson,
          raciJson: capData.raciJson,
        },
      });
    }
  }

  console.log('✅ Seed completed successfully with MuleWave teams and capabilities.');
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
