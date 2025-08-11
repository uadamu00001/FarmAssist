import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { FetchWeatherDto } from './dto/fetch-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly svc: WeatherService) {}

  @Post('fetch')
  async fetch(@Body() dto: FetchWeatherDto) {
    return this.svc.fetchAndSave(dto.lat, dto.lon, dto.farmId);
  }

  @Get('recent')
  async recent(@Query('farmId') farmId?: string, @Query('limit') limit = '10') {
    const n = parseInt(limit, 10) || 10;
    return this.svc.getLatestSnapshots(farmId, n);
  }
}
