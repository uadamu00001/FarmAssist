import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  /**
   * Defines the GET /recommendations/:farmId endpoint.
   * @param farmId The farm ID from the URL parameter.
   * @returns The result from the RecommendationsService.
   */
  @Get(':farmId')
  getRecommendations(@Param('farmId') farmId: string) {
    return this.recommendationsService.getRecommendationsForFarm(farmId);
  }
}
