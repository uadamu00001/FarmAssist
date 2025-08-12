import { Injectable } from '@nestjs/common';
import { GetRecommendationDto } from '../dto/get-recommendation.dto';

@Injectable()
export class FertilizerRecommendationService {
  private rules = [
    {
      crop: 'maize',
      soil: 'loamy',
      fertilizer: 'NPK 15-15-15',
      description: 'Balanced fertilizer for optimal maize growth on loamy soils.',
    },
    {
      crop: 'rice',
      soil: 'clay',
      fertilizer: 'Urea',
      description: 'Nitrogen-rich fertilizer to promote rice tillering in clay soils.',
    },
    {
      crop: 'wheat',
      soil: 'sandy',
      fertilizer: 'DAP',
      description: 'Diammonium phosphate to boost wheat yield in sandy soils.',
    },
  ];

  getRecommendation(dto: GetRecommendationDto) {
    const match = this.rules.find(
      (rule) =>
        rule.crop.toLowerCase() === dto.cropType.toLowerCase() &&
        rule.soil.toLowerCase() === dto.soilType.toLowerCase(),
    );

    if (!match) {
      return {
        fertilizer: 'General Purpose NPK',
        description: 'No exact match found. Use a general balanced fertilizer.',
      };
    }

    return {
      fertilizer: match.fertilizer,
      description: match.description,
    };
  }
}
