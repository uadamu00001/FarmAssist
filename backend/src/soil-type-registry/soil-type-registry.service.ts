import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSoilTypeDto } from './dto/create-soil-type.dto';
import { UpdateSoilTypeDto } from './dto/update-soil-type.dto';
import { SoilType } from './soil-type.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SoilTypeRegistryService {
  private soilTypes: SoilType[] = [];

  create(dto: CreateSoilTypeDto): SoilType {
    const soilType: SoilType = { id: uuidv4(), ...dto };
    this.soilTypes.push(soilType);
    return soilType;
  }

  findAll(): SoilType[] {
    return this.soilTypes;
  }

  findOne(id: string): SoilType {
    const soilType = this.soilTypes.find((s) => s.id === id);
    if (!soilType) throw new NotFoundException('Soil type not found');
    return soilType;
  }

  update(id: string, dto: UpdateSoilTypeDto): SoilType {
    const index = this.soilTypes.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException('Soil type not found');
    this.soilTypes[index] = { ...this.soilTypes[index], ...dto };
    return this.soilTypes[index];
  }

  remove(id: string): void {
    const index = this.soilTypes.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException('Soil type not found');
    this.soilTypes.splice(index, 1);
  }

  classify(dto: CreateSoilTypeDto): string {
    // Simple example logic for classification
    if (dto.pH < 5.5) return 'Acidic';
    if (dto.pH > 7.5) return 'Alkaline';
    if (dto.drainage === 'poor') return 'Clay';
    if (dto.drainage === 'excellent') return 'Sandy';
    return 'Loam';
  }
}
