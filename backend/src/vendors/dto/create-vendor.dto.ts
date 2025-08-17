import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Input } from '../entities/vendor.entity';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputDto) // Important for nested validation
  @IsDefined()
  inputsSold: Input[];
}

// A simple DTO for the nested Input object
class InputDto implements Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: 'Fertilizer' | 'Seed' | 'Equipment';

  @IsNotEmpty()
  price: number;
}
