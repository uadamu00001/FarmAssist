import { GpsService, Coordinates } from './gps.service';

describe('GpsService', () => {
  let service: GpsService;

  beforeEach(() => {
    service = new GpsService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('coordinatesToRegion', () => {
    it('should return Kaduna South region for valid coordinates', () => {
      const coordinates: Coordinates = { latitude: 10.5, longitude: 7.4 };
      const region = service.coordinatesToRegion(coordinates);

      expect(region).toBeDefined();
      expect(region?.id).toBe('kaduna-south');
      expect(region?.name).toBe('Kaduna South');
    });

    it('should return null for coordinates outside any region', () => {
      const coordinates: Coordinates = { latitude: 0, longitude: 0 };
      const region = service.coordinatesToRegion(coordinates);

      expect(region).toBeNull();
    });

    it('should throw error for invalid coordinates', () => {
      const invalidCoordinates: Coordinates = { latitude: 100, longitude: 200 };

      expect(() => {
        service.coordinatesToRegion(invalidCoordinates);
      }).toThrow('Invalid GPS coordinates provided');
    });
  });

  describe('getAllRegions', () => {
    it('should return all farming regions', () => {
      const regions = service.getAllRegions();

      expect(regions).toBeDefined();
      expect(regions.length).toBeGreaterThan(0);
      expect(regions[0]).toHaveProperty('id');
      expect(regions[0]).toHaveProperty('name');
      expect(regions[0]).toHaveProperty('state');
    });
  });

  describe('getRegionById', () => {
    it('should return region by valid ID', () => {
      const region = service.getRegionById('kaduna-south');

      expect(region).toBeDefined();
      expect(region?.id).toBe('kaduna-south');
    });

    it('should return null for invalid ID', () => {
      const region = service.getRegionById('invalid-id');

      expect(region).toBeNull();
    });
  });

  describe('getRegionsByState', () => {
    it('should return regions for valid state', () => {
      const regions = service.getRegionsByState('Kaduna');

      expect(regions).toBeDefined();
      expect(regions.length).toBeGreaterThan(0);
      expect(regions[0].state).toBe('Kaduna');
    });

    it('should return empty array for invalid state', () => {
      const regions = service.getRegionsByState('InvalidState');

      expect(regions).toEqual([]);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      const coord1: Coordinates = { latitude: 10.5, longitude: 7.4 };
      const coord2: Coordinates = { latitude: 10.6, longitude: 7.5 };

      const distance = service.calculateDistance(coord1, coord2);

      expect(distance).toBeGreaterThan(0);
      expect(typeof distance).toBe('number');
    });

    it('should return 0 for same coordinates', () => {
      const coord: Coordinates = { latitude: 10.5, longitude: 7.4 };

      const distance = service.calculateDistance(coord, coord);

      expect(distance).toBe(0);
    });
  });

  describe('findNearestRegion', () => {
    it('should find nearest region for coordinates outside any region', () => {
      const coordinates: Coordinates = { latitude: 5, longitude: 5 };
      const result = service.findNearestRegion(coordinates);

      expect(result).toBeDefined();
      expect(result?.region).toBeDefined();
      expect(result?.distance).toBeGreaterThan(0);
    });

    it('should throw error for invalid coordinates', () => {
      const invalidCoordinates: Coordinates = { latitude: 100, longitude: 200 };

      expect(() => {
        service.findNearestRegion(invalidCoordinates);
      }).toThrow('Invalid GPS coordinates provided');
    });
  });
});
