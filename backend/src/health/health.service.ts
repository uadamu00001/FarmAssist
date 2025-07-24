import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();
  private requestCount = 0;
  private errorCount = 0;
  private totalLatency = 0;

  recordRequest(latency: number, isError: boolean) {
    this.requestCount++;
    this.totalLatency += latency;
    if (isError) this.errorCount++;
  }

  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const avgLatency = this.requestCount ? this.totalLatency / this.requestCount : 0;
    const errorRate = this.requestCount ? this.errorCount / this.requestCount : 0;
    return {
      uptime,
      requestCount: this.requestCount,
      avgLatency,
      errorRate,
    };
  }
} 