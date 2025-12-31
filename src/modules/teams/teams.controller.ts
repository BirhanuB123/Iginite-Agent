import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const ctx = req.tenantContext;
    return this.teamsService.findAll(ctx);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const ctx = req.tenantContext;
    return this.teamsService.findOne(ctx, id);
  }
}
