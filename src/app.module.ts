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
import { AuthModule } from './common/auth/auth.model';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenancyModule,
    AuthModule,
    AuditModule,
    KnowledgeModule,
    WorkflowModule,
    ToolsModule,
    AgentModule,
  ],
  controllers: [HealthController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply tenant middleware to all routes EXCEPT auth and health endpoints
    consumer
      .apply(TenantMiddleware)
      .exclude('auth/(.*)', 'health')
      .forRoutes('*');
  }
}
