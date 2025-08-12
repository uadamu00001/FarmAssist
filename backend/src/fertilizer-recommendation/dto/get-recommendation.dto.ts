import { IsString } from 'class-validator';

export class GetRecommendationDto {
  @IsString()
  cropType: string;

  @IsString()
  soilType: string;
}
