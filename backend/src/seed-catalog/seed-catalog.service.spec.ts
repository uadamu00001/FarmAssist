import { Test, TestingModule } from '@nestjs/testing';
import { SeedCatalogService } from './seed-catalog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Seed } from './entities/seed.entity';
import { Repository } from 'typeorm';

const mockSeed = {
  id: 1,
  cropType: 'Maize',
  germinationRate: 85.5,
  recommendedSeasons: ['Spring', 'Summer'],
  suppliers: ['Supplier A', 'Supplier B'],
};

describe('SeedCatalogService', () => {
  let service: SeedCatalogService;
  let repo: Repository<Seed>;

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockSeed),
    save: jest.fn().mockResolvedValue(mockSeed),
    find: jest.fn().mockResolvedValue([mockSeed]),
    findOne: jest.fn().mockResolvedValue(mockSeed),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedCatalogService,
        {
          provide: getRepositoryToken(Seed),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<SeedCatalogService>(SeedCatalogService);
    repo = module.get<Repository<Seed>>(getRepositoryToken(Seed));
  });

  it('should create a seed', async () => {
    expect(await service.create(mockSeed as any)).toEqual(mockSeed);
    expect(repo.create).toHaveBeenCalledWith(mockSeed);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return all seeds', async () => {
    expect(await service.findAll()).toEqual([mockSeed]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return one seed', async () => {
    expect(await service.findOne(1)).toEqual(mockSeed);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a seed', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockSeed as any);
    expect(await service.update(1, { cropType: 'Wheat' })).toEqual(mockSeed);
    expect(repo.update).toHaveBeenCalledWith(1, { cropType: 'Wheat' });
  });

  it('should remove a seed', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockSeed as any);
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
