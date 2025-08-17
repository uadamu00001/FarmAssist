
import { IsString, IsNumber, Min, Max, IsIn, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSoilTypeDto {
  @ApiProperty({ example: 'Red Loam', description: 'Name of the soil type' })
  @IsString()
  name: string;

  @ApiProperty({ example: 6.5, description: 'pH value (0-14)' })
  @IsNumber()
  @Min(0)
  @Max(14)
  pH: number;

  @ApiProperty({ example: 'moderate', enum: ['poor', 'moderate', 'excellent'], description: 'Drainage quality' })
  @IsIn(['poor', 'moderate', 'excellent'])
  drainage: 'poor' | 'moderate' | 'excellent';

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high'], description: 'Fertility level' })
  @IsIn(['low', 'medium', 'high'])
  fertility: 'low' | 'medium' | 'high';

  @ApiProperty({ example: ['wheat', 'corn'], description: 'Compatible crops', isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  cropCompatibility: string[];
}
