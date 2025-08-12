import { IsNotEmpty, IsNumber, IsString, IsLatitude, IsLongitude } from 'class-validator';

export class CreateFarmProfileDto {
  @IsNumber()
  farmSize: number;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  cropType: string;

  @IsString()
  @IsNotEmpty()
  farmerName: string;

  @IsString()
  @IsNotEmpty()
  farmerContact: string;
}