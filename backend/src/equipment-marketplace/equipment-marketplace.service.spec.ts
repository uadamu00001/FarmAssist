import 'reflect-metadata';
import { NotFoundException } from '@nestjs/common';
import { EquipmentMarketplaceService } from './equipment-marketplace.service';
import { CreateEquipmentListingDto } from './dto/create-equipment-listing.dto';
import { EquipmentType } from './enums/equipment-type.enum';
import { ListingStatus } from './enums/listing-status.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('EquipmentMarketplaceService', () => {
  let service: EquipmentMarketplaceService;
  let repo: any;

  beforeEach(() => {
    repo = {
      create: jest.fn((v) => ({ ...v, id: 'uuid-1' })),
      save: jest.fn(async (v) => v),
      findAndCount: jest.fn(async () => [[], 0]),
      findOne: jest.fn(async () => null),
      remove: jest.fn(async () => undefined),
    };
    service = new EquipmentMarketplaceService(repo);
  });

  it('creates and normalizes currency and strings', async () => {
    const dto: CreateEquipmentListingDto = {
      name: '  Compact Tractor  ',
      type: EquipmentType.TRACTOR,
      price: 12000,
      currency: 'usd',
      location: '  Lagos  ',
      status: ListingStatus.AVAILABLE,
      forSale: true,
    } as any;
    const saved = await service.create(dto);
    expect(saved.currency).toBe('USD');
    expect(saved.name).toBe('Compact Tractor');
    expect(saved.location).toBe('Lagos');
  });

  it('findOne throws NotFoundException when missing', async () => {
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('validates CreateEquipmentListingDto', async () => {
    const invalid = plainToInstance(CreateEquipmentListingDto, {
      name: '',
      type: 'invalid',
      price: -5,
      currency: 'US',
      location: '',
    });
    const errors = await validate(invalid);
    expect(errors.length).toBeGreaterThan(0);
  });
});


