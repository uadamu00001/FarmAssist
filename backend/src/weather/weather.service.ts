import { Injectable, Logger } from '@nestjs/common';

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfallPrediction: 'High' | 'Medium' | 'Low' | 'None';
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  async getWeatherByLocation(location: string): Promise<WeatherData> {
    this.logger.log(`Fetching mock weather for location: ${location}`);

    const mockWeatherData: WeatherData = {
      location: location,
      temperature: 28.5,
      humidity: 82,
      windSpeed: 15,
      rainfallPrediction: 'Medium',
    };

    return Promise.resolve(mockWeatherData);
  }
}
