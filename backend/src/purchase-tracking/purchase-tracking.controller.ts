import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PurchaseRecordingService } from './purchase-tracking.service';
import { CreatePurchaseRecordDto } from './dto/create-purchase-tracking.dto';
import { QueryPurchaseRecordsDto } from './dto/query-purchase-records.dto';

@Controller('purchase-records')
export class PurchaseRecordingController {
  constructor(private readonly purchaseRecordingService: PurchaseRecordingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async recordPurchase(@Body() createPurchaseRecordDto: CreatePurchaseRecordDto) {
    return this.purchaseRecordingService.recordPurchase(createPurchaseRecordDto);
  }

  @Get()
  async findAllPurchases(@Query() query: QueryPurchaseRecordsDto) {
    return this.purchaseRecordingService.findAllPurchases(query);
  }

  @Get('user/:userId')
  async findPurchasesByUser(
    @Param('userId') userId: string,
    @Query() query: QueryPurchaseRecordsDto
  ) {
    return this.purchaseRecordingService.findPurchasesByUser(userId, query);
  }

  @Get('statistics')
  async getPurchaseStatistics(@Query('userId') userId?: string) {
    return this.purchaseRecordingService.getPurchaseStatistics(userId);
  }

  @Get('transaction/:transactionId')
  async findPurchaseByTransactionId(@Param('transactionId') transactionId: string) {
    return this.purchaseRecordingService.findPurchaseByTransactionId(transactionId);
  }

  @Get(':id')
  async findPurchaseById(@Param('id') id: string) {
    return this.purchaseRecordingService.findPurchaseById(id);
  }

  @Patch(':id/status')
  async updatePurchaseStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.purchaseRecordingService.updatePurchaseStatus(id, status);
  }
}