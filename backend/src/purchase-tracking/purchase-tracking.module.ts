import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRecordingService } from './purchase-tracking.service';
import { PurchaseRecordingController } from './purchase-tracking.controller';
import { PurchaseRecord } from './entities/purchase-tracking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseRecord]),
  ],
  controllers: [PurchaseRecordingController],
  providers: [PurchaseRecordingService],
  exports: [PurchaseRecordingService], // Export service for use in other modules
})
export class PurchaseRecordingModule {}