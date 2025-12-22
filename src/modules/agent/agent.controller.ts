import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Post('chat')
  async chat(@Req() req: any, @Body() body: { message: string }) {
    const ctx = req.tenantContext;
    return this.orchestrator.runChat(ctx, body.message);
  }
}
