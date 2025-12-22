import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(
    @Body()
    body: { email: string; password: string; tenantId: string }
  ) {
    if (!body.tenantId) {
      throw new BadRequestException('tenantId is required');
    }

    return this.auth.login(
      body.email,
      body.password,
      body.tenantId
    );
  }
}
