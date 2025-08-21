import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { EquipmentType } from '../enums/equipment-type.enum';
import { ListingStatus } from '../enums/listing-status.enum';

export class CreateEquipmentListingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: EquipmentType })
  @IsEnum(EquipmentType)
  type: EquipmentType;

  @ApiProperty({ minimum: 0, type: Number })
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
  location: string;

  @ApiProperty({ enum: ListingStatus, default: ListingStatus.AVAILABLE })
  @IsEnum(ListingStatus)
  status: ListingStatus = ListingStatus.AVAILABLE;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  forRent?: boolean = false;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  forSale?: boolean = false;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  metadata?: Record<string, any>;
}


