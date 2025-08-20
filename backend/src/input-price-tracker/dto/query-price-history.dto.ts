import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InputType } from '../enums/input-type.enum';
import { PriceFrequency } from '../enums/price-frequency.enum';
import { AggregateFunction } from '../enums/aggregate-function.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPriceHistoryDto {
  @ApiPropertyOptional({ enum: InputType })
  @IsOptional()
  @IsEnum(InputType)
  inputType?: InputType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional({ minLength: 3, maxLength: 3 })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ enum: PriceFrequency })
  @IsOptional()
  @IsEnum(PriceFrequency)
  frequency?: PriceFrequency;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 20;

  @ApiPropertyOptional({ enum: ['effectiveDate', 'createdAt'], default: 'effectiveDate' })
  @IsOptional()
  @IsString()
  sortBy: 'effectiveDate' | 'createdAt' = 'effectiveDate';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ enum: AggregateFunction, default: AggregateFunction.AVG })
  @IsOptional()
  @IsEnum(AggregateFunction)
  aggregate: AggregateFunction = AggregateFunction.AVG;
}


