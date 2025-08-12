import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmProfile } from './farm-profile.entity';
import { CreateFarmProfileDto } from './dto/create-farm-profile.dto';
import { UpdateFarmProfileDto } from './dto/update-farm-profile.dto';

@Injectable()
export class FarmProfileService {
  constructor(
    @InjectRepository(FarmProfile)
    private farmProfileRepo: Repository<FarmProfile>,
  ) {}

  create(dto: CreateFarmProfileDto) {
    const farmProfile = this.farmProfileRepo.create(dto);
    return this.farmProfileRepo.save(farmProfile);
  }

  findAll() {
    return this.farmProfileRepo.find();
  }

  async findOne(id: string) {
    const profile = await this.farmProfileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(`FarmProfile #${id} not found`);
    return profile;
  }

  async update(id: string, dto: UpdateFarmProfileDto) {
    const profile = await this.findOne(id);
    Object.assign(profile, dto);
    return this.farmProfileRepo.save(profile);
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    return this.farmProfileRepo.remove(profile);
  }
}
