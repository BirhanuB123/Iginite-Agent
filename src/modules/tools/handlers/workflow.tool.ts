import { Injectable } from '@nestjs/common';
import { WorkItemsService } from '../../workflow/work-items.service';

@Injectable()
export class WorkflowToolHandlers {
  constructor(private readonly workItems: WorkItemsService) {}

  async createClientRequest(ctx: { tenantId: string; userId?: string }, input: { title: string; details?: string; priority?: string }) {
    return this.workItems.create(ctx.tenantId, {
      type: 'CLIENT_REQUEST',
      title: input.title,
      details: input.details ?? '',
      priority: input.priority ?? 'MEDIUM',
      requestedBy: ctx.userId,
    });
  }
}
