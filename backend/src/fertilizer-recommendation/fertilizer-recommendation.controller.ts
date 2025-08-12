import { Controller, Post, Body } from '@nestjs/common';
import { FertilizerRecommendationService } from './providers/fertilizer-recommendation.service';
import { GetRecommendationDto } from './dto/get-recommendation.dto';

@Controller('fertilizer-recommendation')
export class FertilizerRecommendationController {
  constructor(private readonly fertilizerService: FertilizerRecommendationService) {}

  @Post()
  getRecommendation(@Body() dto: GetRecommendationDto) {
    return this.fertilizerService.getRecommendation(dto);
  }
}
