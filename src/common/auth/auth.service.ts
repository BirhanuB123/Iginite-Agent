import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string, tenantId: string) {
  // 🔐 REQUIRED FOR RLS
  await this.prisma.setTenantContext(tenantId);

  const user = await this.prisma.user.findFirst({
    where: {
      tenantId,
      email,
      status: 'ACTIVE',
    },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = {
    sub: user.id,
    tenantId: user.tenantId,
    roles: ['CLIENT'],
  };

  return {
    accessToken: this.jwt.sign(payload),
    tenantId: user.tenantId,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}
}