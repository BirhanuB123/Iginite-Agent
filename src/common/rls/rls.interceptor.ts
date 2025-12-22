import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { requestContext } from '../request-context/request-context';

@Injectable()
export class RlsInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req: any = http.getRequest();
    const tenant = req.tenantContext;

    // Each request runs inside an interactive transaction to guarantee SET LOCAL.
    return from(
      this.prisma.$transaction(async (tx) => {
        // Set tenant for RLS (transaction-scoped)
        await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenant.tenantId}::text, true);`;

        return await new Promise((resolve, reject) => {
          requestContext.run({ tenant, prisma: tx as any }, async () => {
            try {
              const value = await next.handle().toPromise();
              resolve(value);
            } catch (e) {
              reject(e);
            }
          });
        });
      })
    );
  }
}
