import { IsString, IsNumber, IsArray, ArrayNotEmpty, Min, Max } from 'class-validator';

export class CreateSeedDto {
  @IsString()
  cropType: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  germinationRate: number;

  @IsArray()
  @ArrayNotEmpty()
  recommendedSeasons: string[];

  @IsArray()
  @ArrayNotEmpty()
  suppliers: string[];
}
