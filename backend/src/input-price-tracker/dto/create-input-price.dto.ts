import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, IsISO8601, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InputType } from '../enums/input-type.enum';
import { PriceFrequency } from '../enums/price-frequency.enum';

export class CreateInputPriceDto {
  @IsEnum(InputType)
  inputType: InputType;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  supplierName: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsString()
  @Length(3, 3)
  currency: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsEnum(PriceFrequency)
  frequency: PriceFrequency;

  // YYYY-MM-DD (UTC). For weekly, use week start date
  @IsISO8601()
  effectiveDate: string;

  @IsOptional()
  metadata?: Record<string, any>;
}


