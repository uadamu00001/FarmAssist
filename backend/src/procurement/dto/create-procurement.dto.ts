import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProcurementDto {
  @IsString()
  @IsNotEmpty()
  readonly itemName: string;

  @IsNumber()
  @IsPositive()
  readonly quantity: number;

  @IsNumber()
  @IsPositive()
  readonly cost: number;
}
