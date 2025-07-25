import { Injectable } from '@nestjs/common';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FarmingRegion {
  id: string;
  name: string;
  state: string;
  zone: string;
  climateType: string;
  soilType: string[];
  majorCrops: string[];
  boundaries: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

@Injectable()
export class GpsService {
  private readonly farmingRegions: FarmingRegion[] = [
    {
      id: 'kaduna-south',
      name: 'Kaduna South',
      state: 'Kaduna',
      zone: 'Middle Belt',
      climateType: 'Guinea Savanna',
      soilType: ['Ferruginous', 'Alluvial'],
      majorCrops: ['Maize', 'Rice', 'Yam', 'Cassava', 'Groundnut'],
      boundaries: {
        north: 10.6,
        south: 10.3,
        east: 7.6,
        west: 7.3,
      },
    },
    {
      id: 'kano-central',
      name: 'Kano Central',
      state: 'Kano',
      zone: 'Northern Nigeria',
      climateType: 'Sudan Savanna',
      soilType: ['Sandy', 'Clay'],
      majorCrops: ['Millet', 'Sorghum', 'Cowpea', 'Groundnut', 'Cotton'],
      boundaries: {
        north: 12.2,
        south: 11.8,
        east: 8.7,
        west: 8.3,
      },
    },
    {
      id: 'lagos-mainland',
      name: 'Lagos Mainland',
      state: 'Lagos',
      zone: 'South West',
      climateType: 'Forest',
      soilType: ['Sandy', 'Loamy'],
      majorCrops: ['Cassava', 'Plantain', 'Cocoa', 'Oil Palm', 'Vegetables'],
      boundaries: {
        north: 6.6,
        south: 6.4,
        east: 3.5,
        west: 3.3,
      },
    },
    {
      id: 'enugu-east',
      name: 'Enugu East',
      state: 'Enugu',
      zone: 'South East',
      climateType: 'Forest',
      soilType: ['Lateritic', 'Sandy-loam'],
      majorCrops: ['Yam', 'Cassava', 'Rice', 'Oil Palm', 'Vegetables'],
      boundaries: {
        north: 6.5,
        south: 6.2,
        east: 7.6,
        west: 7.3,
      },
    },
    {
      id: 'plateau-central',
      name: 'Plateau Central',
      state: 'Plateau',
      zone: 'Middle Belt',
      climateType: 'Guinea Savanna',
      soilType: ['Volcanic', 'Loamy'],
      majorCrops: ['Irish Potato', 'Tomato', 'Cabbage', 'Carrot', 'Maize'],
      boundaries: {
        north: 9.3,
        south: 9.0,
        east: 8.9,
        west: 8.6,
      },
    },
  ];

  /**
   * Convert GPS coordinates to farming region
   * @param coordinates - GPS coordinates (latitude, longitude)
   * @returns FarmingRegion or null if no region found
   */
  coordinatesToRegion(coordinates: Coordinates): FarmingRegion | null {
    const { latitude, longitude } = coordinates;

    // Validate coordinates
    if (!this.isValidCoordinate(latitude, longitude)) {
      throw new Error('Invalid GPS coordinates provided');
    }

    // Find matching region
    const region = this.farmingRegions.find((region) =>
      this.isCoordinateInRegion(latitude, longitude, region),
    );

    return region || null;
  }

  /**
   * Get all available farming regions
   * @returns Array of all farming regions
   */
  getAllRegions(): FarmingRegion[] {
    return this.farmingRegions;
  }

  /**
   * Get region by ID
   * @param regionId - Region identifier
   * @returns FarmingRegion or null
   */
  getRegionById(regionId: string): FarmingRegion | null {
    return this.farmingRegions.find((region) => region.id === regionId) || null;
  }

  /**
   * Get regions by state
   * @param state - State name
   * @returns Array of regions in the state
   */
  getRegionsByState(state: string): FarmingRegion[] {
    return this.farmingRegions.filter(
      (region) => region.state.toLowerCase() === state.toLowerCase(),
    );
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * @param coord1 - First coordinate
   * @param coord2 - Second coordinate
   * @returns Distance in kilometers
   */
  calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) *
        Math.cos(this.toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Find nearest region to given coordinates
   * @param coordinates - GPS coordinates
   * @returns Nearest farming region with distance
   */
  findNearestRegion(
    coordinates: Coordinates,
  ): { region: FarmingRegion; distance: number } | null {
    if (!this.isValidCoordinate(coordinates.latitude, coordinates.longitude)) {
      throw new Error('Invalid GPS coordinates provided');
    }

    let nearestRegion: FarmingRegion | null = null;
    let minDistance = Infinity;

    for (const region of this.farmingRegions) {
      // Calculate distance to region center
      const regionCenter: Coordinates = {
        latitude: (region.boundaries.north + region.boundaries.south) / 2,
        longitude: (region.boundaries.east + region.boundaries.west) / 2,
      };

      const distance = this.calculateDistance(coordinates, regionCenter);

      if (distance < minDistance) {
        minDistance = distance;
        nearestRegion = region;
      }
    }

    return nearestRegion
      ? { region: nearestRegion, distance: minDistance }
      : null;
  }

  private isValidCoordinate(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  }

  private isCoordinateInRegion(
    latitude: number,
    longitude: number,
    region: FarmingRegion,
  ): boolean {
    return (
      latitude >= region.boundaries.south &&
      latitude <= region.boundaries.north &&
      longitude >= region.boundaries.west &&
      longitude <= region.boundaries.east
    );
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
