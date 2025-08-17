import { Test, TestingModule } from '@nestjs/testing';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { RolesGuard } from '../auth/roles.guard';
import { CanActivate } from '@nestjs/common';

// Mock the service so we can test the controller in isolation
const mockVendorsService = {
  create: jest.fn((dto) => ({ id: 'new-id', ...dto })),
  findAll: jest.fn(() => [{ id: 'vendor-1', name: 'Test Vendor' }]),
  findOne: jest.fn((id) => ({ id, name: 'Test Vendor' })),
  update: jest.fn((id, dto) => ({ id, ...dto })),
  remove: jest.fn((id) => ({
    message: `Vendor with ID "${id}" successfully deleted.`,
  })),
};

// Mock the guard to always allow access for these tests
const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

describe('VendorsController', () => {
  let controller: VendorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorsController],
      providers: [
        {
          provide: VendorsService,
          useValue: mockVendorsService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<VendorsController>(VendorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a vendor', () => {
    const dto = {
      name: 'New Vendor',
      location: 'Test Location',
      inputsSold: [],
    };
    controller.create(dto);
    expect(mockVendorsService.create).toHaveBeenCalledWith(dto);
  });

  it('should get all vendors', () => {
    controller.findAll();
    expect(mockVendorsService.findAll).toHaveBeenCalled();
  });

  it('should get a single vendor by id', () => {
    const id = 'vendor-1';
    controller.findOne(id);
    expect(mockVendorsService.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a vendor', () => {
    const id = 'vendor-1';
    const dto = { name: 'Updated Name' };
    controller.update(id, dto);
    expect(mockVendorsService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should delete a vendor', () => {
    const id = 'vendor-1';
    controller.remove(id);
    expect(mockVendorsService.remove).toHaveBeenCalledWith(id);
  });
});
