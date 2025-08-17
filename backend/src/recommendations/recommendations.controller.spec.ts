import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { NotFoundException } from '@nestjs/common';

// Create a mock service to isolate the controller tests
const mockRecommendationsService = {
  getRecommendationsForFarm: jest.fn(),
};

describe('RecommendationsController', () => {
  let controller: RecommendationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        {
          provide: RecommendationsService,
          useValue: mockRecommendationsService,
        },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(RecommendationsController);
  });

  afterEach(() => {
    // Clear mock history after each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecommendations', () => {
    it('should call the service with the correct farmId and return its result', () => {
      const farmId = 'farm-101';
      const mockResponse = {
        farmDetails: { farmId: 'farm-101', cropType: 'Maize', sizeInAcres: 5 },
        recommendedInputs: [{ input: 'NPK', quantity: '15 bags' }],
      };

      // Setup the mock to return a specific value when called
      mockRecommendationsService.getRecommendationsForFarm.mockReturnValue(
        mockResponse,
      );

      const result = controller.getRecommendations(farmId);

      // Check that the service was called with the correct parameter
      expect(
        mockRecommendationsService.getRecommendationsForFarm,
      ).toHaveBeenCalledWith(farmId);

      // Check that the controller returns the value from the service
      expect(result).toEqual(mockResponse);
    });

    it('should propagate exceptions from the service', () => {
      const invalidFarmId = 'farm-999';

      // Setup the mock to throw an error when called
      mockRecommendationsService.getRecommendationsForFarm.mockImplementation(
        () => {
          throw new NotFoundException(
            `Farm with ID "${invalidFarmId}" not found.`,
          );
        },
      );

      // Verify that the controller throws the same exception
      expect(() => controller.getRecommendations(invalidFarmId)).toThrow(
        NotFoundException,
      );
    });
  });
});
