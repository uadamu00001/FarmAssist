import { PartialType } from '@nestjs/mapped-types';
import { CreateSoilTypeDto } from './create-soil-type.dto';

export class UpdateSoilTypeDto extends PartialType(CreateSoilTypeDto) {}
