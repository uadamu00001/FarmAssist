import { IsString, IsArray, IsNumber, IsOptional, ValidateNested, Min, IsUUID, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  sku?: string;
}

export class CreatePurchaseRecordDto {
  @IsUUID()
  userId: string;

  @IsString()
  transactionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items: CreatePurchaseItemDto[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @IsString()
  @IsIn(['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD'])
  currency: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['completed', 'pending', 'failed', 'refunded'])
  status?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}