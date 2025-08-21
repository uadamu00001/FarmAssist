import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { InputPrice } from './entities/input-price.entity';
import { InputType } from './enums/input-type.enum';
import { PriceFrequency } from './enums/price-frequency.enum';
import { CreateInputPriceDto } from './dto/create-input-price.dto';
import { UpdateInputPriceDto } from './dto/update-input-price.dto';
import { QueryPriceHistoryDto } from './dto/query-price-history.dto';
import { AggregateFunction } from './enums/aggregate-function.enum';

@Injectable()
export class InputPriceTrackerService {
  constructor(
    @InjectRepository(InputPrice)
    private readonly inputPriceRepository: Repository<InputPrice>,
  ) {}

  private normalizeForPersistence<T extends Partial<InputPrice>>(payload: T): T {
    if ((payload as any).currency) {
      (payload as any).currency = String((payload as any).currency).toUpperCase();
    }
    if ((payload as any).itemName) {
      (payload as any).itemName = String((payload as any).itemName).trim();
    }
    if ((payload as any).supplierName) {
      (payload as any).supplierName = String((payload as any).supplierName).trim();
    }
    if ((payload as any).effectiveDate) {
      const dateOnly = new Date((payload as any).effectiveDate).toISOString().slice(0, 10);
      (payload as any).effectiveDate = dateOnly as any;
    }
    return payload;
  }

  async create(dto: CreateInputPriceDto): Promise<InputPrice> {
    try {
      const entity = this.inputPriceRepository.create(this.normalizeForPersistence(dto) as any);
      const saved = await this.inputPriceRepository.save(entity as any);
      return saved as InputPrice;
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('A price entry for this item/supplier/period already exists');
      }
      throw error;
    }
  }

  async bulkCreate(dtos: CreateInputPriceDto[]): Promise<{ created: number; skipped: number }>
  {
    let created = 0;
    let skipped = 0;
    for (const dto of dtos) {
      try {
        await this.create(dto);
        created += 1;
      } catch (error: any) {
        if (error instanceof ConflictException) {
          skipped += 1;
          continue;
        }
        throw error;
      }
    }
    return { created, skipped };
  }

  async findAll(query: QueryPriceHistoryDto): Promise<{ records: InputPrice[]; total: number }>
  {
    const { page, limit, sortBy, sortOrder, inputType, itemName, supplierName, frequency, startDate, endDate, currency } = query;

    const where: FindOptionsWhere<InputPrice> = {};
    if (inputType) where.inputType = inputType as InputType;
    if (itemName) where.itemName = itemName;
    if (supplierName) where.supplierName = supplierName;
    if (frequency) where.frequency = frequency as PriceFrequency;
    if (currency) where.currency = currency;
    if (startDate && endDate) {
      where.effectiveDate = Between(startDate, endDate) as any;
    }

    const [records, total] = await this.inputPriceRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder } as any,
      skip: (page - 1) * Math.min(limit, 100),
      take: Math.min(limit, 100),
    });

    return { records, total };
  }

  async findOne(id: string): Promise<InputPrice> {
    const record = await this.inputPriceRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Price entry not found');
    return record;
  }

  async update(id: string, dto: UpdateInputPriceDto): Promise<InputPrice> {
    const record = await this.findOne(id);
    Object.assign(record, this.normalizeForPersistence(dto));
    try {
      return await this.inputPriceRepository.save(record);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Updating would create a duplicate price entry for this period');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.inputPriceRepository.remove(record);
  }

  async getTrends(query: QueryPriceHistoryDto): Promise<Array<{ effectiveDate: string; value: number }>> {
    const { inputType, itemName, supplierName, frequency, startDate, endDate, aggregate, currency } = query;

    const qb = this.inputPriceRepository.createQueryBuilder('p')
      .select('p.effective_date', 'effectiveDate');

    const aggColumn = 'p.price';
    const aggAlias = 'value';
    const aggFn = aggregate?.toUpperCase() || AggregateFunction.AVG.toUpperCase();
    qb.addSelect(`${aggFn}(${aggColumn})`, aggAlias);

    if (inputType) qb.andWhere('p.input_type = :inputType', { inputType });
    if (itemName) qb.andWhere('p.item_name = :itemName', { itemName });
    if (supplierName) qb.andWhere('p.supplier_name = :supplierName', { supplierName });
    if (frequency) qb.andWhere('p.frequency = :frequency', { frequency });
    if (currency) qb.andWhere('p.currency = :currency', { currency });
    if (startDate) qb.andWhere('p.effective_date >= :startDate', { startDate });
    if (endDate) qb.andWhere('p.effective_date <= :endDate', { endDate });

    qb.groupBy('p.effective_date').orderBy('p.effective_date', 'ASC');

    const rows = await qb.getRawMany<{ effectiveDate: string; value: string }>();
    return rows.map(r => ({ effectiveDate: r.effectiveDate, value: Number(r.value) }));
  }
}


