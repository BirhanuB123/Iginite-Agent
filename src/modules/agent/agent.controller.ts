import { Body, Controller, Post, Req, BadRequestException } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Post('chat')
  async chat(@Req() req: any, @Body() body: { message: string }) {
    // Validation
    if (!body.message) {
      throw new BadRequestException('message is required');
    }

    if (typeof body.message !== 'string') {
      throw new BadRequestException('message must be a string');
    }

    if (body.message.trim().length === 0) {
      throw new BadRequestException('message cannot be empty');
    }

    if (body.message.length > 10000) {
      throw new BadRequestException('message must be less than 10000 characters');
    }

    const ctx = req.tenantContext;
    
    try {
      return await this.orchestrator.runChat(ctx, body.message.trim());
    } catch (error: any) {
      // Log error for debugging
      console.error('Chat error:', error);
      
      // Return user-friendly error
      if (error.message?.includes('quota')) {
        throw new BadRequestException('OpenAI API quota exceeded. Please check your API key and billing.');
      }
      
      throw new BadRequestException(`Failed to process chat: ${error.message || 'Unknown error'}`);
    }
  }
}
