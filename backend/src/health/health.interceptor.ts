import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HealthService } from './health.service';

@Injectable()
export class HealthInterceptor implements NestInterceptor {
  constructor(private readonly healthService: HealthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const latency = Date.now() - start;
        this.healthService.recordRequest(latency, false);
      }),
      catchError((err) => {
        const latency = Date.now() - start;
        this.healthService.recordRequest(latency, true);
        throw err;
      })
    );
  }
} 