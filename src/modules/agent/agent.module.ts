import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { OrchestratorService } from './orchestrator.service';
import { ToolsModule } from '../tools/tools.module';
import { AuditModule } from '../../common/audit/audit.module';
import { PolicyService } from '../../common/auth/policy.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RlsInterceptor } from '../../common/rls/rls.interceptor';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [ToolsModule, AuditModule, PrismaModule],
  controllers: [AgentController],
  providers: [
    OrchestratorService,
    PolicyService,
    { provide: APP_INTERCEPTOR, useClass: RlsInterceptor },
  ],
})
export class AgentModule {}
