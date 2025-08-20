import { Test, TestingModule } from '@nestjs/testing';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CanActivate } from '@nestjs/common';

// Mock service
const mockFarmsService = {
  create: jest.fn((dto, userId) => ({
    id: 'new-farm-id',
    ownerId: userId,
    ...dto,
  })),
};

// Mock guards to always pass
const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

describe('FarmsController', () => {
  let controller: FarmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [
        {
          provide: FarmsService,
          useValue: mockFarmsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<FarmsController>(FarmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a farm', () => {
    const dto = {
      cropType: 'Sorghum',
      location: 'Texas',
      sizeInAcres: 50,
    };
    // Mock the request object with a user
    const mockRequest = {
      user: { id: 'user-farmer-456', roles: ['farmer'] },
    };

    controller.create(dto, mockRequest);
    expect(mockFarmsService.create).toHaveBeenCalledWith(
      dto,
      mockRequest.user.id,
    );
  });
});
