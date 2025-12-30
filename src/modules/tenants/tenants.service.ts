import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class TenantsService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(input: {
    companyName: string;
    adminName: string;
    adminEmail: string;
    password: string;
  }) {
    const existing = await this.prisma.user.findFirst({
      where: { email: input.adminEmail },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const tenantId = randomUUID();
    const userId = randomUUID();

    const passwordHash = await bcrypt.hash(input.password, 10);

    // Create tenant
    await this.prisma.tenant.create({
      data: {
        id: tenantId,
        name: input.companyName,
        status: 'ACTIVE',
      },
    });

    // Create admin user (RLS not needed for signup - direct queries with tenantId)
    await this.prisma.user.create({
      data: {
        id: userId,
        tenantId,
        email: input.adminEmail,
        name: input.adminName,
        password: passwordHash,
        status: 'ACTIVE',
      },
    });

    // Seed default teams
    const defaultTeams = ['HR', 'Finance', 'Engineering', 'DevOps', 'Security'];

    for (const name of defaultTeams) {
      await this.prisma.team.create({
        data: {
          id: randomUUID(),
          tenantId,
          name,
          visibility: 'CLIENT',
        },
      });
    }

    // Issue JWT
    const token = this.jwt.sign({
      sub: userId,
      tenantId,
      roles: ['TENANT_ADMIN'],
    });

    return {
      accessToken: token,
      tenantId,
      user: {
        id: userId,
        email: input.adminEmail,
        name: input.adminName,
      },
    };
  }
}
