import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantResolver } from './tenant.resolver';
import { TenantContext } from './tenant-context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly resolver: TenantResolver) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = this.resolver.resolveTenantId(req);

    // For MVP: inject roles/userId from headers. Replace with OIDC/JWT later.
    const userId = req.header('x-user-id') ?? undefined;
    const rolesHeader = req.header('x-roles') ?? '';
    const roles = rolesHeader ? rolesHeader.split(',').map(s => s.trim()).filter(Boolean) : [];

    (req as any).tenantContext = { tenantId, userId, roles } satisfies TenantContext;
    next();
  }
}
