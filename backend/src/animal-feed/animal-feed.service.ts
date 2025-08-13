import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimalFeed } from './animal-feed.entity';
import { CreateAnimalFeedDto } from './dto/create-animal-feed.dto';
import { UpdateAnimalFeedDto } from './dto/update-animal-feed.dto';

@Injectable()
export class AnimalFeedService {
  constructor(
    @InjectRepository(AnimalFeed)
    private readonly repo: Repository<AnimalFeed>,
  ) {}

  async create(dto: CreateAnimalFeedDto): Promise<AnimalFeed> {
    const entity = this.repo.create({
      name: dto.name.trim(),
      description: dto.description?.trim() ?? null,
      nutrition: dto.nutrition ?? null,
      recommendedSpecies: dto.recommendedSpecies || [],
      storageRequirements: dto.storageRequirements ?? null,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<AnimalFeed[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<AnimalFeed> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Animal feed not found');
    return found;
  }

  async update(id: string, dto: UpdateAnimalFeedDto): Promise<AnimalFeed> {
    const entity = await this.findOne(id);
    if (dto.name !== undefined) entity.name = dto.name.trim();
    if (dto.description !== undefined) entity.description = dto.description?.trim() ?? null;
    if (dto.nutrition !== undefined) entity.nutrition = dto.nutrition ?? null;
    if (dto.recommendedSpecies !== undefined) entity.recommendedSpecies = dto.recommendedSpecies || [];
    if (dto.storageRequirements !== undefined) entity.storageRequirements = dto.storageRequirements ?? null;
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    await this.repo.remove(existing);
  }
}
