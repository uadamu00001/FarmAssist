import { PartialType } from '@nestjs/mapped-types';
import { CreateInputPriceDto } from './create-input-price.dto';

export class UpdateInputPriceDto extends PartialType(CreateInputPriceDto) {}


