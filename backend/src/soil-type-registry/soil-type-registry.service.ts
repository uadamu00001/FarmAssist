
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
    if (dto.pH < 5.5 && dto.drainage === 'poor' && dto.fertility === 'low') {
      return 'Acidic Heavy Clay (Low Fertility)';
    }
    if (dto.pH > 7.5 && dto.drainage === 'excellent' && dto.fertility === 'high') {
      return 'Alkaline Sandy (High Fertility)';
    }
    if (dto.pH >= 6 && dto.pH <= 7.5 && dto.drainage === 'moderate' && dto.fertility === 'high') {
      return 'Ideal Loam';
    }
    if (dto.drainage === 'poor') {
      return 'Clay';
    }
    if (dto.drainage === 'excellent') {
      return 'Sandy';
    }
    if (dto.fertility === 'low') {
      return 'Infertile Soil';
    }
    return 'General';
  }

  filterByPhRange(min: number, max: number): SoilType[] {
    return this.soilTypes.filter(s => s.pH >= min && s.pH <= max);
  }

  filterByDrainage(drainage: 'poor' | 'moderate' | 'excellent'): SoilType[] {
    return this.soilTypes.filter(s => s.drainage === drainage);
  }

  filterByCrop(crop: string): SoilType[] {
    return this.soilTypes.filter(s => s.cropCompatibility.includes(crop));
  }

  /**
   * Suggest crops based on soil properties.
   */
  suggestCrops(dto: CreateSoilTypeDto): string[] {
    if (dto.pH >= 6 && dto.pH <= 7.5 && dto.drainage === 'moderate' && dto.fertility === 'high') {
      return ['wheat', 'corn', 'soybean'];
    }
    if (dto.pH < 5.5) {
      return ['potato', 'sweet potato', 'blueberry'];
    }
    if (dto.drainage === 'excellent') {
      return ['carrot', 'peanut', 'watermelon'];
    }
    if (dto.fertility === 'low') {
      return ['millet', 'sorghum'];
    }
    return ['generic crop'];
  }

}