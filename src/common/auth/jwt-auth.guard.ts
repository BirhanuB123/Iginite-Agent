import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = auth.replace('Bearer ', '');

    try {
      const payload = this.jwt.verify(token);

      // Attach user info to request
      req.user = {
        id: payload.sub,
        tenantId: payload.tenantId,
        email: payload.email,
        roles: payload.roles || [],
      };

      // Update tenant context if it exists (from middleware)
      if (req.tenantContext) {
        req.tenantContext.userId = payload.sub;
        req.tenantContext.roles = payload.roles || [];
      }

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
