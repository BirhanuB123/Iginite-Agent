import { Body, Controller, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      companyName: string;
      adminName: string;
      adminEmail: string;
      password: string;
    }
  ) {
    return this.tenants.signup(body);
  }
}
