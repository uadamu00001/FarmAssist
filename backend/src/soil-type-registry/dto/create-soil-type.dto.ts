import { IsString, IsNumber, Min, Max, IsIn, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateSoilTypeDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(14)
  pH: number;

  @IsIn(['poor', 'moderate', 'excellent'])
  drainage: 'poor' | 'moderate' | 'excellent';

  @IsIn(['low', 'medium', 'high'])
  fertility: 'low' | 'medium' | 'high';

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  cropCompatibility: string[];
}
