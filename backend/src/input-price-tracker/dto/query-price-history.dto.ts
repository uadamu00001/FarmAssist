import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InputType } from '../enums/input-type.enum';
import { PriceFrequency } from '../enums/price-frequency.enum';
import { AggregateFunction } from '../enums/aggregate-function.enum';

export class QueryPriceHistoryDto {
  @IsOptional()
  @IsEnum(InputType)
  inputType?: InputType;

  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsEnum(PriceFrequency)
  frequency?: PriceFrequency;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 20;

  @IsOptional()
  @IsString()
  sortBy: 'effectiveDate' | 'createdAt' = 'effectiveDate';

  @IsOptional()
  @IsString()
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsEnum(AggregateFunction)
  aggregate: AggregateFunction = AggregateFunction.AVG;
}


