import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { PurchaseRecord } from './entities/purchase-tracking.entity';
import { CreatePurchaseRecordDto } from './dto/create-purchase-tracking.dto';
import { QueryPurchaseRecordsDto } from './dto/query-purchase-records.dto';

@Injectable()
export class PurchaseRecordingService {
  private readonly logger = new Logger(PurchaseRecordingService.name);

  constructor(
    @InjectRepository(PurchaseRecord)
    private readonly purchaseRecordRepository: Repository<PurchaseRecord>,
  ) {}

  async recordPurchase(createPurchaseRecordDto: CreatePurchaseRecordDto): Promise<PurchaseRecord> {
    try {
      // Check if transaction already exists
      const existingRecord = await this.purchaseRecordRepository.findOne({
        where: { transactionId: createPurchaseRecordDto.transactionId }
      });

      if (existingRecord) {
        throw new ConflictException(`Purchase record with transaction ID ${createPurchaseRecordDto.transactionId} already exists`);
      }

      const purchaseRecord = this.purchaseRecordRepository.create(createPurchaseRecordDto);
      const savedRecord = await this.purchaseRecordRepository.save(purchaseRecord);

      this.logger.log(`Purchase recorded: ${savedRecord.id} for user ${savedRecord.userId}`);
      return savedRecord;
    } catch (error) {
      this.logger.error(`Failed to record purchase: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findPurchasesByUser(userId: string, query: QueryPurchaseRecordsDto): Promise<{ records: PurchaseRecord[], total: number }> {
    const { page, limit, sortBy, sortOrder, startDate, endDate, status } = query;
    
    const where: FindOptionsWhere<PurchaseRecord> = { userId };
    
    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [records, total] = await this.purchaseRecordRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { records, total };
  }

  async findAllPurchases(query: QueryPurchaseRecordsDto): Promise<{ records: PurchaseRecord[], total: number }> {
    const { page, limit, sortBy, sortOrder, startDate, endDate, status, userId, transactionId } = query;
    
    const where: FindOptionsWhere<PurchaseRecord> = {};
    
    if (userId) {
      where.userId = userId;
    }

    if (transactionId) {
      where.transactionId = transactionId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [records, total] = await this.purchaseRecordRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { records, total };
  }

  async findPurchaseById(id: string): Promise<PurchaseRecord> {
    const record = await this.purchaseRecordRepository.findOne({ where: { id } });
    
    if (!record) {
      throw new NotFoundException(`Purchase record with ID ${id} not found`);
    }

    return record;
  }

  async findPurchaseByTransactionId(transactionId: string): Promise<PurchaseRecord> {
    const record = await this.purchaseRecordRepository.findOne({ where: { transactionId } });
    
    if (!record) {
      throw new NotFoundException(`Purchase record with transaction ID ${transactionId} not found`);
    }

    return record;
  }

  async updatePurchaseStatus(id: string, status: string): Promise<PurchaseRecord> {
    const record = await this.findPurchaseById(id);
    record.status = status;
    
    const updatedRecord = await this.purchaseRecordRepository.save(record);
    this.logger.log(`Purchase status updated: ${id} to ${status}`);
    
    return updatedRecord;
  }

  async getPurchaseStatistics(userId?: string): Promise<any> {
    const queryBuilder = this.purchaseRecordRepository.createQueryBuilder('purchase');
    
    if (userId) {
      queryBuilder.where('purchase.userId = :userId', { userId });
    }

    const totalPurchases = await queryBuilder.getCount();
    
    const totalAmount = await queryBuilder
      .select('SUM(purchase.totalAmount)', 'total')
      .getRawOne();

    const averageAmount = await queryBuilder
      .select('AVG(purchase.totalAmount)', 'average')
      .getRawOne();

    const statusBreakdown = await queryBuilder
      .select('purchase.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('purchase.status')
      .getRawMany();

    return {
      totalPurchases,
      totalAmount: parseFloat(totalAmount.total) || 0,
      averageAmount: parseFloat(averageAmount.average) || 0,
      statusBreakdown,
    };
  }
}
