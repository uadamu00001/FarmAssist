import { Module } from '@nestjs/common';
import { SoilTypeRegistryService } from './soil-type-registry.service';
import { SoilTypeRegistryController } from './soil-type-registry.controller';

@Module({
  controllers: [SoilTypeRegistryController],
  providers: [SoilTypeRegistryService],
  exports: [SoilTypeRegistryService],
})
export class SoilTypeRegistryModule {}
