import { Module } from '@nestjs/common';
import { InventoryTrackingService } from './inventory-stock.service';
import { InventoryTrackingController } from './inventoryStock.controller';

@Module({
  controllers: [InventoryTrackingController],
  providers: [InventoryTrackingService],
})
export class InventoryTrackingModule {}
