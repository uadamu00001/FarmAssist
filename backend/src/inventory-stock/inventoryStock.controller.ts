import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { InventoryTrackingService } from './inventory-stock.service';
import { CreateInventoryStockDto } from './dto/createInventoryStockDto';
import { UpdateInventoryStockDto } from './dto/updateInventoryStockDto';

@Controller('inventory')
export class InventoryTrackingController {
  constructor(private readonly inventoryTrackingService: InventoryTrackingService) {}

  @Post()
  create(@Body() dto: CreateInventoryStockDto) {
    return this.inventoryTrackingService.create(dto);
  }

  @Get()
  findAll() {
    return this.inventoryTrackingService.findAll();
  }

  @Get('farmer/:farmerId')
  findByFarmer(@Param('farmerId') farmerId: number) {
    return this.inventoryTrackingService.findByFarmer(Number(farmerId));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateInventoryStockDto) {
    return this.inventoryTrackingService.update(Number(id), dto);
  }
}
