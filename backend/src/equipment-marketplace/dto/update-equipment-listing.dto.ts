import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentListingDto } from './create-equipment-listing.dto';

export class UpdateEquipmentListingDto extends PartialType(CreateEquipmentListingDto) {}


