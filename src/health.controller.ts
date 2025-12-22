import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/health')
  health() {
    return {
      status: 'ok',
      service: 'ignite-agent',
      timestamp: new Date().toISOString(),
    };
  }
}
