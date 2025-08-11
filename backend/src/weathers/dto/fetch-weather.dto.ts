import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FetchWeatherDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;

  @IsOptional()
  @IsString()
  farmId?: string;
}
