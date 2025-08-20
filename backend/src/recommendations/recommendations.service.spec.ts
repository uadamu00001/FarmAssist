import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from './recommendations.service';
import { NotFoundException } from '@nestjs/common';

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommendationsService],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecommendationsForFarm', () => {
    it('should return recommendations for a valid Maize farm', () => {
      const farmId = 'farm-101'; // A 5-acre Maize farm
      const result = service.getRecommendationsForFarm(farmId);

      expect(result).toBeDefined();
      expect(result.farmDetails.farmId).toEqual(farmId);
      expect(result.farmDetails.cropType).toEqual('Maize');
      expect(result.recommendedInputs.length).toBeGreaterThan(0);
      // Check if calculations are correct based on size
      expect(result.recommendedInputs[0].quantity).toContain('15 bags'); // 5 acres * 3 bags
      expect(result.recommendedInputs[1].quantity).toContain('20 kg'); // 5 acres * 4 kg
    });

    it('should return recommendations for a valid Rice farm', () => {
      const farmId = 'farm-102'; // A 10-acre Rice farm
      const result = service.getRecommendationsForFarm(farmId);

      expect(result).toBeDefined();
      expect(result.farmDetails.cropType).toEqual('Rice');
      expect(result.recommendedInputs.length).toBeGreaterThan(0);
      expect(result.recommendedInputs[0].quantity).toContain('40 bags'); // 10 acres * 4 bags
    });

    it('should throw NotFoundException for an invalid farmId', () => {
      const invalidFarmId = 'farm-999';
      // We wrap the function call in a lambda to test if it throws an error
      expect(() => service.getRecommendationsForFarm(invalidFarmId)).toThrow(
        NotFoundException,
      );
      expect(() => service.getRecommendationsForFarm(invalidFarmId)).toThrow(
        `Farm with ID "${invalidFarmId}" not found.`,
      );
    });
  });
});
