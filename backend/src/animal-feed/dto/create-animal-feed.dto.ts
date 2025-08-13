import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAnimalFeedDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  nutrition?: Record<string, any>;

  @IsArray()
  @IsString({ each: true })
  recommendedSpecies: string[];

  @IsOptional()
  @IsObject()
  storageRequirements?: Record<string, any>;
}
