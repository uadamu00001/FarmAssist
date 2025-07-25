import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthService();
  });

  it('should initialize with zero metrics', () => {
    const metrics = service.getMetrics();
    expect(metrics.requestCount).toBe(0);
    expect(metrics.avgLatency).toBe(0);
    expect(metrics.errorRate).toBe(0);
    expect(metrics.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should record successful requests and calculate average latency', () => {
    service.recordRequest(100, false);
    service.recordRequest(200, false);
    const metrics = service.getMetrics();
    expect(metrics.requestCount).toBe(2);
    expect(metrics.avgLatency).toBe(150);
    expect(metrics.errorRate).toBe(0);
  });

  it('should record errors and calculate error rate', () => {
    service.recordRequest(100, true);
    service.recordRequest(200, false);
    const metrics = service.getMetrics();
    expect(metrics.requestCount).toBe(2);
    expect(metrics.errorRate).toBe(0.5);
  });
}); 