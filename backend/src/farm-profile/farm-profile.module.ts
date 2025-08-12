import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmProfileService } from './farm-profile.service';
import { FarmProfileController } from './farm-profile.controller';
import { FarmProfile } from './farm-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FarmProfile])],
  controllers: [FarmProfileController],
  providers: [FarmProfileService],
})
export class FarmProfileModule {}
