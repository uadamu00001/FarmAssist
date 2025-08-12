

import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmProfileDto } from './create-farm-profile.dto';

export class UpdateFarmProfileDto extends PartialType(CreateFarmProfileDto) {}
