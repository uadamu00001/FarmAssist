import { Test, TestingModule } from '@nestjs/testing';
import { VendorsService } from './vendors.service';
import { NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';

describe('VendorsService', () => {
  let service: VendorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorsService],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new vendor', () => {
      const createDto: CreateVendorDto = {
        name: 'Farm Fresh Co.',
        location: 'California',
        inputsSold: [{ name: 'Organic Seeds', type: 'Seed', price: 25 }],
      };
      const newVendor = service.create(createDto);
      expect(newVendor).toBeDefined();
      expect(newVendor.name).toEqual(createDto.name);
      expect(newVendor.id).toBeDefined();
      // Check if it was added to the list
      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('should return an array of vendors', () => {
      const vendors = service.findAll();
      expect(Array.isArray(vendors)).toBe(true);
      expect(vendors.length).toBe(1); // The initial mock vendor
    });
  });

  describe('findOne', () => {
    it('should return a single vendor by id', () => {
      const vendorId = 'vendor-1';
      const vendor = service.findOne(vendorId);
      expect(vendor).toBeDefined();
      expect(vendor.id).toEqual(vendorId);
    });

    it('should throw NotFoundException if vendor is not found', () => {
      expect(() => service.findOne('invalid-id')).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the vendor', () => {
      const vendorId = 'vendor-1';
      const updateDto = { name: 'Updated Agro Supplies' };
      const updatedVendor = service.update(vendorId, updateDto);
      expect(updatedVendor.name).toEqual(updateDto.name);
    });

    it('should throw NotFoundException when trying to update a non-existent vendor', () => {
      expect(() => service.update('invalid-id', { name: 'test' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a vendor and return a success message', () => {
      const vendorId = 'vendor-1';
      const response = service.remove(vendorId);
      expect(response.message).toContain('successfully deleted');
      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException when trying to remove a non-existent vendor', () => {
      expect(() => service.remove('invalid-id')).toThrow(NotFoundException);
    });
  });
});
