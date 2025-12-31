import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TenantContext } from '../../common/tenant/tenant-context';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(ctx: TenantContext) {
    const teams = await this.prisma.team.findMany({
      where: { tenantId: ctx.tenantId },
      include: {
        capabilities: true,
        _count: {
          select: {
            workItems: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return teams.map(team => ({
      id: team.id,
      name: team.name,
      description: team.description,
      visibility: team.visibility,
      capabilities: team.capabilities.map(cap => ({
        id: cap.id,
        capability: cap.capability,
        sla: cap.slaJson,
        raci: cap.raciJson,
      })),
      workItemCount: team._count.workItems,
      createdAt: team.createdAt,
    }));
  }

  async findOne(ctx: TenantContext, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: {
        id: teamId,
        tenantId: ctx.tenantId,
      },
      include: {
        capabilities: true,
        workItems: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!team) {
      return null;
    }

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      visibility: team.visibility,
      capabilities: team.capabilities.map(cap => ({
        id: cap.id,
        capability: cap.capability,
        sla: cap.slaJson,
        raci: cap.raciJson,
      })),
      recentWorkItems: team.workItems,
      createdAt: team.createdAt,
    };
  }
}
