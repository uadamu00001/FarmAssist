import { Test, TestingModule } from '@nestjs/testing';
import { ProcurementController } from './procurement.controller';
import { ProcurementService } from './procurement.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

describe('ProcurementController', () => {
  let controller: ProcurementController;
  let service: ProcurementService;

  const mockProcurementService = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 'user-uuid-123',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcurementController],
      providers: [
        {
          provide: ProcurementService,
          useValue: mockProcurementService,
        },
      ],
    })
      // Mock the guard to bypass actual authentication
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProcurementController>(ProcurementController);
    service = module.get<ProcurementService>(ProcurementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service to create a procurement record', async () => {
      const createDto: CreateProcurementDto = {
        itemName: 'New Laptop',
        quantity: 1,
        cost: 1500,
      };
      const expectedResult = { id: 'proc-uuid-456', ...createDto };
      mockProcurementService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(
        createDto,
        mockRequest.user.userId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call the service to get all records for the user', async () => {
      const expectedResult = [{ itemName: 'Old Records' }];
      mockProcurementService.findAllForUser.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest);

      expect(service.findAllForUser).toHaveBeenCalledWith(
        mockRequest.user.userId,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
