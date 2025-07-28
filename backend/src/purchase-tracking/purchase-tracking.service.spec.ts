import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseTrackingService } from './purchase-tracking.service';

describe('PurchaseTrackingService', () => {
  let service: PurchaseTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseTrackingService],
    }).compile();

    service = module.get<PurchaseTrackingService>(PurchaseTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
