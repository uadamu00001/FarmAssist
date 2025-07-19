import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { Procurement } from './entities/procurement.entity';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(Procurement)
    private readonly procurementRepository: Repository<Procurement>,
  ) {}

  async create(
    createProcurementDto: CreateProcurementDto,
    userId: string,
  ): Promise<Procurement> {
    const newProcurement = this.procurementRepository.create({
      ...createProcurementDto,
      owner: { id: userId },
    });

    return this.procurementRepository.save(newProcurement);
  }

  async findAllForUser(userId: string): Promise<Procurement[]> {
    return this.procurementRepository.find({
      where: {
        owner: { id: userId },
      },
      order: {
        procurementDate: 'DESC',
      },
    });
  }
}
