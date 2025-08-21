import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { EquipmentListing } from './entities/equipment-listing.entity';
import { CreateEquipmentListingDto } from './dto/create-equipment-listing.dto';
import { UpdateEquipmentListingDto } from './dto/update-equipment-listing.dto';
import { QueryEquipmentListingsDto } from './dto/query-equipment-listings.dto';

@Injectable()
export class EquipmentMarketplaceService {
  constructor(
    @InjectRepository(EquipmentListing)
    private readonly listingRepo: Repository<EquipmentListing>,
  ) {}

  private normalize<T extends Partial<EquipmentListing>>(payload: T): T {
    if ((payload as any).currency) {
      (payload as any).currency = String((payload as any).currency).toUpperCase();
    }
    if ((payload as any).name) {
      (payload as any).name = String((payload as any).name).trim();
    }
    if ((payload as any).location) {
      (payload as any).location = String((payload as any).location).trim();
    }
    return payload;
  }

  async create(dto: CreateEquipmentListingDto): Promise<EquipmentListing> {
    try {
      const entity = this.listingRepo.create(this.normalize(dto) as any);
      return await this.listingRepo.save(entity as any);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Listing violates a unique constraint');
      }
      throw error;
    }
  }

  async findAll(query: QueryEquipmentListingsDto): Promise<{ records: EquipmentListing[]; total: number }>
  {
    const { type, status, location, currency, page, limit, sortBy, sortOrder } = query;
    const where: FindOptionsWhere<EquipmentListing> = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (currency) where.currency = currency;
    if (location) where.location = ILike(`%${location}%`);

    const [records, total] = await this.listingRepo.findAndCount({
      where,
      order: { [sortBy]: sortOrder } as any,
      skip: (page - 1) * Math.min(limit, 100),
      take: Math.min(limit, 100),
    });

    return { records, total };
  }

  async findOne(id: string): Promise<EquipmentListing> {
    const found = await this.listingRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Listing not found');
    return found;
  }

  async update(id: string, dto: UpdateEquipmentListingDto): Promise<EquipmentListing> {
    const found = await this.findOne(id);
    Object.assign(found, this.normalize(dto));
    try {
      return await this.listingRepo.save(found);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Update violates a unique constraint');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const found = await this.findOne(id);
    await this.listingRepo.remove(found);
  }
}


