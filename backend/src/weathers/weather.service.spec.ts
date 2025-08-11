import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../src/weather/weather.service';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { WeatherSnapshot } from '../src/weather/entities/weather-snapshot.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let repo: Repository<WeatherSnapshot>;

  const fakeApiKey = 'FAKE_KEY';
  const ENV_BACKUP = process.env;

  beforeAll(() => {
    process.env = { ...ENV_BACKUP, WEATHER_API_KEY: fakeApiKey };
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(WeatherSnapshot),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
    repo = module.get<Repository<WeatherSnapshot>>(getRepositoryToken(WeatherSnapshot));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch from API and save a snapshot', async () => {
    const fakeResponseData = {
      main: {
        temp: 22.5,
        humidity: 70,
      },
      dt: 1690000000, // sample epoch
    };

    const axiosResp: Partial<AxiosResponse> = { data: fakeResponseData, status: 200 };
    (httpService.get as jest.Mock).mockReturnValue(of(axiosResp));
    const created = { id: '1', lat: 1, lon: 2 };
    (repo.create as jest.Mock).mockReturnValue(created);
    (repo.save as jest.Mock).mockResolvedValue({ ...created, temperature: 22.5, humidity: 70 });

    const result = await service.fetchAndSave(1, 2, 'farm-123');

    expect(httpService.get).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      lat: 1, lon: 2, farmId: 'farm-123',
    }));
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(result.temperature).toBe(22.5);
    expect(result.humidity).toBe(70);
  });

  it('should throw InternalServerErrorException when API key missing', async () => {
    // temporarily unset key
    const envBackup = process.env.WEATHER_API_KEY;
    delete process.env.WEATHER_API_KEY;

    // re-import constants is not needed here because the service reads process.env at runtime via weather.constants
    try {
      await expect(service.fetchAndSave(1, 2)).rejects.toBeInstanceOf(InternalServerErrorException);
    } finally {
      process.env.WEATHER_API_KEY = envBackup;
    }
  });

  it('should throw InternalServerErrorException when http request fails', async () => {
    (httpService.get as jest.Mock).mockReturnValue(
      // simulate observable that errors
      of().pipe(() => { throw new Error('network'); }),
    );

    // Alternatively, mock lastValueFrom to throw; easier: set get to return an observable that throws when subscribed
    (httpService.get as jest.Mock).mockImplementation(() => {
      return {
        toPromise: () => Promise.reject(new Error('network error')),
        // but we use lastValueFrom in service, which subscribes; easier to throw via Promise
      };
    });

    // Force the call to reject
    await expect(service.fetchAndSave(0, 0)).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
