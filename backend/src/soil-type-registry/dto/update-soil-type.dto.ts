import { PartialType } from '@nestjs/mapped-types';
import { CreateSoilTypeDto } from './create-soil-type.dto';

/**
 * DTO for updating a soil type. All fields are optional.
 */
export class UpdateSoilTypeDto extends PartialType(CreateSoilTypeDto) {}
