import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentMarketplaceController } from './equipment-marketplace.controller';
import { EquipmentMarketplaceService } from './equipment-marketplace.service';
import { EquipmentListing } from './entities/equipment-listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentListing])],
  controllers: [EquipmentMarketplaceController],
  providers: [EquipmentMarketplaceService],
})
export class EquipmentMarketplaceModule {}


