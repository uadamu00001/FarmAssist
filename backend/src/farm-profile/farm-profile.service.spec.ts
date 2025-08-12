import { Test, TestingModule } from '@nestjs/testing';
import { FarmProfileService } from './farm-profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FarmProfile } from './farm-profile.entity';
import { Repository } from 'typeorm';

describe('FarmProfileService', () => {
  let service: FarmProfileService;
  let repo: Repository<FarmProfile>;

  const mockFarmProfile = {
    id: 'uuid-123',
    farmSize: 5,
    latitude: 10.5,
    longitude: 20.3,
    cropType: 'Maize',
    farmerName: 'John Doe',
    farmerContact: '123456789',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmProfileService,
        {
          provide: getRepositoryToken(FarmProfile),
          useValue: {
            create: jest.fn().mockReturnValue(mockFarmProfile),
            save: jest.fn().mockResolvedValue(mockFarmProfile),
            find: jest.fn().mockResolvedValue([mockFarmProfile]),
            findOne: jest.fn().mockResolvedValue(mockFarmProfile),
            remove: jest.fn().mockResolvedValue(mockFarmProfile),
          },
        },
      ],
    }).compile();

    service = module.get<FarmProfileService>(FarmProfileService);
    repo = module.get<Repository<FarmProfile>>(getRepositoryToken(FarmProfile));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a farm profile', async () => {
    const result = await service.create(mockFarmProfile);
    expect(result).toEqual(mockFarmProfile);
    expect(repo.create).toHaveBeenCalledWith(mockFarmProfile);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should find all farm profiles', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockFarmProfile]);
  });

  it('should find one farm profile', async () => {
    const result = await service.findOne('uuid-123');
    expect(result).toEqual(mockFarmProfile);
  });

  it('should update a farm profile', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockFarmProfile as any);
    const result = await service.update('uuid-123', { cropType: 'Rice' });
    expect(result).toEqual(mockFarmProfile);
  });

  it('should remove a farm profile', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockFarmProfile as any);
    const result = await service.remove('uuid-123');
    expect(result).toEqual(mockFarmProfile);
  });
});
