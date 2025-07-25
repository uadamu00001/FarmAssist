import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { GpsService, Coordinates, FarmingRegion } from './gps.service';

@Controller('gps')
export class GpsController {
  constructor(private readonly gpsService: GpsService) {}

  @Get('region')
  getRegionFromCoordinates(
    @Query('lat') latitude: string,
    @Query('lng') longitude: string,
  ): FarmingRegion | { message: string; nearestRegion?: any } {
    if (!latitude || !longitude) {
      throw new BadRequestException('Latitude and longitude are required');
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Invalid coordinate values');
    }

    const coordinates: Coordinates = { latitude: lat, longitude: lng };
    const region = this.gpsService.coordinatesToRegion(coordinates);

    if (region) {
      return region;
    }

    // If no exact region found, return nearest region
    const nearest = this.gpsService.findNearestRegion(coordinates);
    return {
      message: 'No exact region found for coordinates',
      nearestRegion: nearest
        ? {
            ...nearest.region,
            distanceKm: Math.round(nearest.distance * 100) / 100,
          }
        : null,
    };
  }

  @Get('regions')
  getAllRegions(): FarmingRegion[] {
    return this.gpsService.getAllRegions();
  }

  @Get('regions/state')
  getRegionsByState(@Query('state') state: string): FarmingRegion[] {
    if (!state) {
      throw new BadRequestException('State parameter is required');
    }
    return this.gpsService.getRegionsByState(state);
  }

  @Get('distance')
  calculateDistance(
    @Query('lat1') lat1: string,
    @Query('lng1') lng1: string,
    @Query('lat2') lat2: string,
    @Query('lng2') lng2: string,
  ): { distance: number; unit: string } {
    if (!lat1 || !lng1 || !lat2 || !lng2) {
      throw new BadRequestException('All coordinate parameters are required');
    }

    const coord1: Coordinates = {
      latitude: parseFloat(lat1),
      longitude: parseFloat(lng1),
    };

    const coord2: Coordinates = {
      latitude: parseFloat(lat2),
      longitude: parseFloat(lng2),
    };

    if (
      isNaN(coord1.latitude) ||
      isNaN(coord1.longitude) ||
      isNaN(coord2.latitude) ||
      isNaN(coord2.longitude)
    ) {
      throw new BadRequestException('Invalid coordinate values');
    }

    const distance = this.gpsService.calculateDistance(coord1, coord2);
    return {
      distance: Math.round(distance * 100) / 100,
      unit: 'kilometers',
    };
  }
}
