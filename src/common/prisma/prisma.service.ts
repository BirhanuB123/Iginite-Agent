import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { requestContext } from '../request-context/request-context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Returns the request-scoped transaction client when available,
   * otherwise returns the root Prisma client.
   */
  client(): PrismaClient {
    const store = requestContext.getStore();
    return store?.prisma ?? this;
  }
}
