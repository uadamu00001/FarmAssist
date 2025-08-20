import { Test, TestingModule } from '@nestjs/testing';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';

describe('FarmsService', () => {
  let service: FarmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FarmsService],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new farm and assign it to an owner', () => {
      const createDto: CreateFarmDto = {
        cropType: 'Wheat',
        location: 'Kansas',
        sizeInAcres: 100,
      };
      const ownerId = 'user-farmer-123';

      const newFarm = service.create(createDto, ownerId);

      expect(newFarm).toBeDefined();
      expect(newFarm.id).toBeDefined();
      expect(newFarm.ownerId).toEqual(ownerId);
      expect(newFarm.cropType).toEqual(createDto.cropType);
      expect(newFarm.createdAt).toBeInstanceOf(Date);

      // Verify it was stored
      const userFarms = service.findByOwner(ownerId);
      expect(userFarms).toHaveLength(1);
      expect(userFarms[0].id).toEqual(newFarm.id);
    });
  });
});
