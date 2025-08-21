import 'reflect-metadata';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InputPriceTrackerService } from './input-price-tracker.service';
import { InputPrice } from './entities/input-price.entity';
import { InputType } from './enums/input-type.enum';
import { PriceFrequency } from './enums/price-frequency.enum';
import { CreateInputPriceDto } from './dto/create-input-price.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('InputPriceTrackerService', () => {
  let service: InputPriceTrackerService;
  let repo: any;

  beforeEach(() => {
    const qb = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    } as any;

    repo = {
      create: jest.fn((v) => ({ ...v, id: 'uuid-1' })),
      save: jest.fn(async (v) => v),
      findAndCount: jest.fn(async () => [[], 0]),
      findOne: jest.fn(async () => null),
      remove: jest.fn(async () => undefined),
      createQueryBuilder: jest.fn(() => qb),
    };
    service = new InputPriceTrackerService(repo);
  });

  it('creates a price entry and normalizes fields', async () => {
    const dto: CreateInputPriceDto = {
      inputType: InputType.SEED,
      itemName: '  Maize Hybrid X  ',
      supplierName: '  Supplier A  ',
      price: 45.5,
      currency: 'usd',
      unit: 'kg',
      frequency: PriceFrequency.DAILY,
      effectiveDate: '2025-08-19T15:00:00.000Z',
      metadata: { region: 'West' },
    };

    const saved = await service.create(dto);

    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(saved.currency).toBe('USD');
    expect(saved.itemName).toBe('Maize Hybrid X');
    expect(saved.supplierName).toBe('Supplier A');
    expect(saved.effectiveDate).toBe('2025-08-19');
  });

  it('throws ConflictException on unique violation', async () => {
    repo.save.mockRejectedValueOnce({ code: '23505' });
    const dto: CreateInputPriceDto = {
      inputType: InputType.SEED,
      itemName: 'Maize',
      supplierName: 'S1',
      price: 10,
      currency: 'USD',
      unit: 'kg',
      frequency: PriceFrequency.DAILY,
      effectiveDate: '2025-01-01',
    };
    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it('bulkCreate counts created and skipped', async () => {
    const dtos: CreateInputPriceDto[] = [
      {
        inputType: InputType.FERTILIZER,
        itemName: 'NPK',
        supplierName: 'S1',
        price: 60,
        currency: 'USD',
        unit: 'bag',
        frequency: PriceFrequency.WEEKLY,
        effectiveDate: '2025-08-18',
      },
      {
        inputType: InputType.FERTILIZER,
        itemName: 'NPK',
        supplierName: 'S1',
        price: 62,
        currency: 'USD',
        unit: 'bag',
        frequency: PriceFrequency.WEEKLY,
        effectiveDate: '2025-08-18',
      },
    ];
    // Simulate unique violation on second save
    repo.save
      .mockResolvedValueOnce({ id: '1' })
      .mockRejectedValueOnce({ code: '23505' });

    const result = await service.bulkCreate(dtos);
    expect(result).toEqual({ created: 1, skipped: 1 });
  });

  it('findOne throws NotFoundException when missing', async () => {
    repo.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update merges and saves, handling unique conflict', async () => {
    const existing: Partial<InputPrice> = {
      id: 'uuid-1',
      currency: 'USD',
      itemName: 'Item',
      supplierName: 'S1',
      effectiveDate: '2025-01-01',
    };
    repo.findOne.mockResolvedValue(existing);
    repo.save.mockRejectedValueOnce({ code: '23505' });
    await expect(service.update('uuid-1', { itemName: 'New' } as any)).rejects.toBeInstanceOf(ConflictException);
  });

  it('remove deletes after findOne', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 'uuid-1' });
    await service.remove('uuid-1');
    expect(repo.remove).toHaveBeenCalledWith({ id: 'uuid-1' });
  });

  it('validates CreateInputPriceDto (currency length and price >= 0)', async () => {
    const invalid = plainToInstance(CreateInputPriceDto, {
      inputType: InputType.SEED,
      itemName: 'Maize',
      supplierName: 'S1',
      price: -1,
      currency: 'US', // invalid length
      unit: 'kg',
      frequency: PriceFrequency.DAILY,
      effectiveDate: 'not-a-date',
    });

    const errors = await validate(invalid);
    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map(e => e.property);
    expect(props).toEqual(expect.arrayContaining(['price', 'currency', 'effectiveDate']));
  });
});


