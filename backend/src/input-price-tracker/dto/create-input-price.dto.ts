import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, IsISO8601, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InputType } from '../enums/input-type.enum';
import { PriceFrequency } from '../enums/price-frequency.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInputPriceDto {
  @ApiProperty({ enum: InputType })
  @IsEnum(InputType)
  inputType: InputType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  supplierName: string;

  @ApiProperty({ minimum: 0, type: Number, description: 'Up to 2 decimal places' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ minLength: 3, maxLength: 3, example: 'USD' })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ enum: PriceFrequency })
  @IsEnum(PriceFrequency)
  frequency: PriceFrequency;

  // YYYY-MM-DD (UTC). For weekly, use week start date
  @ApiProperty({ example: '2025-08-19' })
  @IsISO8601()
  effectiveDate: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  metadata?: Record<string, any>;
}


