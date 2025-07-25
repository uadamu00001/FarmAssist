import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('/health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return health metrics', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('requestCount');
    expect(res.body).toHaveProperty('avgLatency');
    expect(res.body).toHaveProperty('errorRate');
  });

  it('should update metrics after requests', async () => {
    await request(app.getHttpServer()).get('/');
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.body.requestCount).toBeGreaterThan(0);
  });
}); 