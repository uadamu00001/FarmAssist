import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin') // Only users with the 'admin' role can access this
  create(@Body(new ValidationPipe()) createVendorDto: CreateVendorDto) {
    // To test this, you'd need a mock user on the request object.
    // An auth middleware would normally handle this.
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin') // Only users with the 'admin' role can access this
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }
}
