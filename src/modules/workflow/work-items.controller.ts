import { Controller, Get, Param, Req } from '@nestjs/common';
import { WorkItemsService } from './work-items.service';

@Controller('work-items')
export class WorkItemsController {
  constructor(private readonly workItems: WorkItemsService) {}

  @Get(':id')
  async get(@Req() req: any, @Param('id') id: string) {
    const ctx = req.tenantContext;
    return this.workItems.get(ctx.tenantId, id);
  }
}
