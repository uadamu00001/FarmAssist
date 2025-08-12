import { Module } from '@nestjs/common';
import { FertilizerRecommendationController } from './fertilizer-recommendation.controller';
import { FertilizerRecommendationService } from './providers/fertilizer-recommendation.service';

@Module({
  controllers: [FertilizerRecommendationController],
  providers: [FertilizerRecommendationService],
  exports: [FertilizerRecommendationService],
})
export class FertilizerRecommendationModule {}
