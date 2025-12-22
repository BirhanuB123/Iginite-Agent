import { AsyncLocalStorage } from 'async_hooks';
import { PrismaClient } from '@prisma/client';
import { TenantContext } from '../tenant/tenant-context';

export type RequestContextStore = {
  tenant: TenantContext;
  prisma: PrismaClient; // transaction-scoped client
};

export const requestContext = new AsyncLocalStorage<RequestContextStore>();
