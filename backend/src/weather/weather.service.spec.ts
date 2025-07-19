import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService, WeatherData } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeatherByLocation', () => {
    it('should return mock weather data for a given location', async () => {
      const location = 'Abuja';
      const weatherData: WeatherData =
        await service.getWeatherByLocation(location);

      expect(weatherData).toBeDefined();

      expect(weatherData.location).toEqual(location);

      expect(weatherData).toHaveProperty('temperature');
      expect(typeof weatherData.temperature).toBe('number');

      expect(weatherData).toHaveProperty('humidity');
      expect(typeof weatherData.humidity).toBe('number');

      expect(weatherData).toHaveProperty('rainfallPrediction');
      expect(typeof weatherData.rainfallPrediction).toBe('string');
    });
  });
});
