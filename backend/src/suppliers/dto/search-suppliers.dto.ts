import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class SearchSuppliersDto {
  @IsString()
  @IsNotEmpty()
  readonly product: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly longitude: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  readonly radius?: number = 50; // Default radius in kilometers

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  readonly limit?: number = 20; // Default limit

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  readonly minRating?: number;

  @IsOptional()
  @IsString()
  readonly sortBy?: 'distance' | 'rating' | 'name' = 'distance';

  @IsOptional()
  @IsString()
  readonly city?: string;

  @IsOptional()
  @IsString()
  readonly state?: string;
}
