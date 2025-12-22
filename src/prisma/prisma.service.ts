import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async setTenantContext(tenantId: string) {
    await this.$executeRawUnsafe(
      `SET app.tenant_id = '${tenantId}'`
    );
  }
}