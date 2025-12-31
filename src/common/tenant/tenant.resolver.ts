import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TenantResolver {
  resolveTenantId(req: Request): string {
    const mode = process.env.TENANT_RESOLUTION_MODE ?? 'header';

    if (mode === 'header') {
      const header = req.header('x-tenant-id');
      if (!header) throw new BadRequestException('Missing X-Tenant-Id header');
      return header;
    }

    // subdomain mode: clientA.adwa-agent.com -> "clientA" (map to UUID in DB in production)
    const host = req.hostname;
    const parts = host.split('.');
    if (parts.length >= 3) return parts[0];

    throw new Error('Tenant not resolved');
  }
}
