import { Injectable } from '@nestjs/common';
import { TenantContext } from '../tenant/tenant-context';

@Injectable()
export class PolicyService {
  canExecuteTool(ctx: TenantContext, toolName: string, _input: any): boolean {
    const roles = ctx.roles ?? [];
    const writeTools = new Set(['create_client_request']);

    if (!writeTools.has(toolName)) return true;

    return roles.includes('CLIENT') || roles.includes('INTERNAL') || roles.includes('ADMIN');
  }
}
