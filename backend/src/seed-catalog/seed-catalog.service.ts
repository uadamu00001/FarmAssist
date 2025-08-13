import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed } from './entities/seed.entity';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';

@Injectable()
export class SeedCatalogService {
  constructor(
    @InjectRepository(Seed)
    private readonly seedRepository: Repository<Seed>,
  ) {}

  async create(createSeedDto: CreateSeedDto): Promise<Seed> {
    const seed = this.seedRepository.create(createSeedDto);
    return this.seedRepository.save(seed);
  }

  async findAll(): Promise<Seed[]> {
    return this.seedRepository.find();
  }

  async findOne(id: number): Promise<Seed> {
    const seed = await this.seedRepository.findOne({ where: { id } });
    if (!seed) throw new NotFoundException(`Seed with ID ${id} not found`);
    return seed;
  }

  async update(id: number, updateSeedDto: UpdateSeedDto): Promise<Seed> {
    await this.findOne(id);
    await this.seedRepository.update(id, updateSeedDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.seedRepository.delete(id);
  }
}
