import { Test, TestingModule } from '@nestjs/testing';
import { FertilizerRecommendationService } from './providers/fertilizer-recommendation.service';
import { GetRecommendationDto } from './dto/get-recommendation.dto';

describe('FertilizerRecommendationService', () => {
  let service: FertilizerRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FertilizerRecommendationService],
    }).compile();

    service = module.get<FertilizerRecommendationService>(FertilizerRecommendationService);
  });

  it('should recommend NPK 15-15-15 for maize on loamy soil', () => {
    const dto: GetRecommendationDto = { cropType: 'maize', soilType: 'loamy' };
    const result = service.getRecommendation(dto);
    expect(result.fertilizer).toBe('NPK 15-15-15');
  });

  it('should recommend Urea for rice on clay soil', () => {
    const dto: GetRecommendationDto = { cropType: 'rice', soilType: 'clay' };
    const result = service.getRecommendation(dto);
    expect(result.fertilizer).toBe('Urea');
  });

  it('should return general fertilizer if no match', () => {
    const dto: GetRecommendationDto = { cropType: 'cassava', soilType: 'silty' };
    const result = service.getRecommendation(dto);
    expect(result.fertilizer).toBe('General Purpose NPK');
  });
});
