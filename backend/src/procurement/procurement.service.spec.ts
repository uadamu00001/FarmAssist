import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcurementService } from './procurement.service';
import { Procurement } from './entities/procurement.entity';
import { CreateProcurementDto } from './dto/create-procurement.dto';

describe('ProcurementService', () => {
  let service: ProcurementService;
  let repository: Repository<Procurement>;

  const mockProcurementRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const userId = 'user-uuid-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcurementService,
        {
          provide: getRepositoryToken(Procurement),
          useValue: mockProcurementRepository,
        },
      ],
    }).compile();

    service = module.get<ProcurementService>(ProcurementService);
    repository = module.get<Repository<Procurement>>(
      getRepositoryToken(Procurement),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new procurement record for a user', async () => {
      const createDto: CreateProcurementDto = {
        itemName: 'Test Item',
        quantity: 10,
        cost: 99.99,
      };
      const expectedRecord = { ...createDto, owner: { id: userId } };

      // Mock the repository methods
      mockProcurementRepository.create.mockReturnValue(expectedRecord);
      mockProcurementRepository.save.mockResolvedValue(expectedRecord);

      const result = await service.create(createDto, userId);

      expect(mockProcurementRepository.create).toHaveBeenCalledWith({
        ...createDto,
        owner: { id: userId },
      });
      expect(mockProcurementRepository.save).toHaveBeenCalledWith(
        expectedRecord,
      );
      expect(result).toEqual(expectedRecord);
    });
  });

  describe('findAllForUser', () => {
    it('should find and return all procurement records for a specific user', async () => {
      const mockRecords = [{ itemName: 'Item 1' }, { itemName: 'Item 2' }];
      mockProcurementRepository.find.mockResolvedValue(mockRecords);

      const result = await service.findAllForUser(userId);

      expect(mockProcurementRepository.find).toHaveBeenCalledWith({
        where: { owner: { id: userId } },
        order: { procurementDate: 'DESC' },
      });
      expect(result).toEqual(mockRecords);
    });
  });
});
