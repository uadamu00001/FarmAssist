import { Injectable } from '@nestjs/common';
import { InventoryStock } from './inventory-stock.entity';
import { CreateInventoryStockDto } from './dto/createInventoryStockDto';
import { UpdateInventoryStockDto } from './dto/updateInventoryStockDto';

@Injectable()
export class InventoryTrackingService {
  private inputStocks: InventoryStock[] = [];

  create(dto: CreateInventoryStockDto): InventoryStock {
    const stock: InventoryStock = {
      id: this.inputStocks.length + 1,
      farmerId: dto.farmerId,
      inputType: dto.inputType,
      quantity: dto.quantity,
      unit: dto.unit || '',
      lastUpdated: new Date(),
    };
    this.inputStocks.push(stock);
    return stock;
  }

  findAll(): InventoryStock[] {
    return this.inputStocks;
  }

  findByFarmer(farmerId: number): InventoryStock[] {
    return this.inputStocks.filter(stock => stock.farmerId === farmerId);
  }

  update(id: number, dto: UpdateInventoryStockDto): InventoryStock | undefined {
    const stock = this.inputStocks.find(s => s.id === id);
    if (stock) {
      if (dto.quantity !== undefined) stock.quantity = dto.quantity;
      if (dto.unit !== undefined) stock.unit = dto.unit;
      stock.lastUpdated = new Date();
    }
    return stock;
  }
}
