import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseTrackingController } from './purchase-tracking.controller';
import { PurchaseTrackingService } from './purchase-tracking.service';

describe('PurchaseTrackingController', () => {
  let controller: PurchaseTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseTrackingController],
      providers: [PurchaseTrackingService],
    }).compile();

    controller = module.get<PurchaseTrackingController>(PurchaseTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
