import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    tenantId: string,
    actorUserId: string | undefined,
    eventType: string,
    toolName: string | undefined,
    request: unknown,
    response: unknown,
  ) {
    const client = this.prisma.client();
    await client.auditEvent.create({
      data: {
        id: crypto.randomUUID(),
        tenantId,
        actorUserId,
        eventType,
        toolName,
        requestJson: request as any,
        responseJson: response as any,
      },
    });
  }
}
