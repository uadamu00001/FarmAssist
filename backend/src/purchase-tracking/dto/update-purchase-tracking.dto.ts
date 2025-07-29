import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseTrackingDto } from './create-purchase-tracking.dto';

export class UpdatePurchaseTrackingDto extends PartialType(CreatePurchaseTrackingDto) {}
