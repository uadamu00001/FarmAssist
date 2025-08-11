import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { WeatherSnapshot } from './entities/weather-snapshot.entity';
import { WEATHER_MODULE } from './weather.constants';

@Injectable()
export class WeatherService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(WeatherSnapshot)
    private readonly repo: Repository<WeatherSnapshot>,
  ) {}

  /**
   * Fetches current weather for lat/lon and persists a snapshot.
   * Returns the saved WeatherSnapshot.
   */
  async fetchAndSave(lat: number, lon: number, farmId?: string): Promise<WeatherSnapshot> {
    if (!WEATHER_MODULE.API_KEY) {
      throw new InternalServerErrorException('Weather API key not configured');
    }

    const url = `${WEATHER_MODULE.BASE_URL}/weather`;
    const params = {
      lat,
      lon,
      appid: WEATHER_MODULE.API_KEY,
      units: 'metric',
    };

    try {
      const response$ = this.http.get(url, { params });
      const response = await lastValueFrom(response$);
      const data = response.data;

      const snapshot = this.repo.create({
        farmId: farmId ?? null,
        lat,
        lon,
        temperature: data?.main?.temp ?? null,
        humidity: data?.main?.humidity ?? null,
        raw: data ?? null,
        fetchedAt: data?.dt ? new Date(data.dt * 1000) : new Date(),
      });

      return await this.repo.save(snapshot);
    } catch (err) {
      // keep the error shape clear for tests and logging
      throw new InternalServerErrorException(
        `Failed to fetch or persist weather data: ${err?.message ?? err}`,
      );
    }
  }

  /** Return last N snapshots for a farm or coordinates */
  async getLatestSnapshots(
    farmId?: string,
    limit = 10,
  ): Promise<WeatherSnapshot[]> {
    const qb = this.repo.createQueryBuilder('ws').orderBy('ws.fetchedAt', 'DESC').limit(limit);
    if (farmId) {
      qb.where('ws.farmId = :farmId', { farmId });
    }
    return qb.getMany();
  }
}
