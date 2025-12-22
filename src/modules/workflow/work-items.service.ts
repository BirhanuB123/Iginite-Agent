import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class WorkItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, input: { type: string; title: string; details: string; priority: string; requestedBy?: string }) {
    const client = this.prisma.client();
    const workItem = await client.workItem.create({
      data: {
        id: crypto.randomUUID(),
        tenantId,
        type: input.type,
        title: input.title,
        details: input.details,
        priority: input.priority,
        requestedBy: input.requestedBy,
      },
    });
    return { workItemId: workItem.id, status: workItem.status };
  }

  async get(tenantId: string, id: string) {
    const client = this.prisma.client();
    const item = await client.workItem.findFirst({ where: { tenantId, id } });
    if (!item) return null;
    return item;
  }
}
