import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/health')
  async health() {
    const checks: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'adwa-agent',
      version: '0.1.0',
      checks: {}
    };

    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.checks.database = { status: 'ok', message: 'Connected' };
    } catch (error: any) {
      checks.checks.database = { status: 'error', message: error.message };
      checks.status = 'degraded';
    }

    // Check OpenAI API key
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      checks.checks.openai = { status: 'ok', message: 'API key configured' };
    } else {
      checks.checks.openai = { status: 'error', message: 'API key not configured' };
      checks.status = 'degraded';
    }

    // Check pgvector extension
    try {
      const result = await this.prisma.$queryRaw<Array<{ extversion: string }>>`
        SELECT extversion FROM pg_extension WHERE extname = 'vector'
      `;
      if (result && result.length > 0) {
        checks.checks.pgvector = { 
          status: 'ok', 
          message: `Installed (v${result[0].extversion})` 
        };
      } else {
        checks.checks.pgvector = { status: 'error', message: 'Not installed' };
        checks.status = 'degraded';
      }
    } catch (error: any) {
      checks.checks.pgvector = { status: 'error', message: error.message };
      checks.status = 'degraded';
    }

    return checks;
  }

  @Get('/ping')
  ping() {
    return { pong: true, timestamp: new Date().toISOString() };
  }
}
