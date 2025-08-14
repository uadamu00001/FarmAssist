import { IsArray, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAnimalFeedDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  nutrition?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendedSpecies?: string[];

  @IsOptional()
  @IsObject()
  storageRequirements?: Record<string, any>;
}
