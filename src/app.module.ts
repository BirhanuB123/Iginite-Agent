import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenancyModule } from './common/tenant/tenancy.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ToolsModule } from './modules/tools/tools.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { AgentModule } from './modules/agent/agent.module';
import { TenantMiddleware } from './common/tenant/tenant.middleware';
import { AuditModule } from './common/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenancyModule,
    AuditModule,
    KnowledgeModule,
    WorkflowModule,
    ToolsModule,
    AgentModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
