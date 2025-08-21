import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InputPrice } from './entities/input-price.entity';
import { InputPriceTrackerService } from './input-price-tracker.service';
import { InputPriceTrackerController } from './input-price-tracker.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InputPrice])],
  controllers: [InputPriceTrackerController],
  providers: [InputPriceTrackerService],
})
export class InputPriceTrackerModule {}


