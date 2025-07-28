import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferences } from './entities/user-preferences.entity';
import { CreateUserPreferencesDto } from './dto/create-user-preferences.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreferences)
    private repo: Repository<UserPreferences>,
  ) {}

  create(dto: CreateUserPreferencesDto) {
    const preference = this.repo.create(dto);
    return this.repo.save(preference);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const pref = await this.repo.findOne({ where: { id } });
    if (!pref) throw new NotFoundException('Preferences not found');
    return pref;
  }

  async update(id: string, dto: UpdateUserPreferencesDto) {
    const pref = await this.findOne(id);
    Object.assign(pref, dto);
    return this.repo.save(pref);
  }

  async remove(id: string) {
    const pref = await this.findOne(id);
    return this.repo.remove(pref);
  }
}
