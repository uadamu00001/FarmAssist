import { Injectable, NotFoundException } from '@nestjs/common';

// --- Mock Data ---
// In a real application, you would fetch this from a database.
const mockFarms = [
  { farmId: 'farm-101', cropType: 'Maize', sizeInAcres: 5 },
  { farmId: 'farm-102', cropType: 'Rice', sizeInAcres: 10 },
  { farmId: 'farm-103', cropType: 'Cassava', sizeInAcres: 2 },
  { farmId: 'farm-104', cropType: 'Maize', sizeInAcres: 15 },
];

@Injectable()
export class RecommendationsService {
  /**
   * Generates mock input recommendations for a given farm ID.
   * @param farmId The ID of the farm to get recommendations for.
   * @returns An object containing the farm details and recommended inputs.
   */
  getRecommendationsForFarm(farmId: string) {
    // 1. Find the farm in our mock database.
    const farm = mockFarms.find((f) => f.farmId === farmId);

    if (!farm) {
      throw new NotFoundException(`Farm with ID "${farmId}" not found.`);
    }

    // 2. Generate recommendations based on the farm's crop type and size.
    let suggestions = [];
    const { cropType, sizeInAcres } = farm;

    switch (cropType) {
      case 'Maize':
        suggestions = [
          {
            input: 'NPK 15-15-15 Fertilizer',
            quantity: `${sizeInAcres * 3} bags`,
            reason: 'Essential for early-stage maize growth.',
          },
          {
            input: 'Maize Seeds (Hybrid Variety)',
            quantity: `${sizeInAcres * 4} kg`,
            reason: 'High-yield variety suitable for this farm size.',
          },
          {
            input: 'Herbicide (Pre-emergence)',
            quantity: `${sizeInAcres * 1} liters`,
            reason: 'Controls weeds before they can compete with the crop.',
          },
        ];
        break;

      case 'Rice':
        suggestions = [
          {
            input: 'Urea Fertilizer',
            quantity: `${sizeInAcres * 4} bags`,
            reason: 'High nitrogen content boosts leaf growth for paddy rice.',
          },
          {
            input: 'Rice Seedlings (FARO 44)',
            quantity: `${sizeInAcres * 25} kg`,
            reason: 'A popular and resilient long-grain variety.',
          },
        ];
        break;

      case 'Cassava':
        suggestions = [
          {
            input: 'Muriate of Potash (MOP)',
            quantity: `${sizeInAcres * 2} bags`,
            reason: 'Potassium is crucial for tuber development in cassava.',
          },
          {
            input: 'Cassava Stems (TME 419)',
            quantity: `${sizeInAcres * 60} bundles`,
            reason: 'A disease-resistant and high-yield variety.',
          },
        ];
        break;

      default:
        suggestions = [
          {
            input: 'No recommendations available',
            quantity: 'N/A',
            reason: `Recommendations for crop type "${cropType}" are not yet implemented.`,
          },
        ];
        break;
    }

    return {
      farmDetails: farm,
      recommendedInputs: suggestions,
    };
  }
}
