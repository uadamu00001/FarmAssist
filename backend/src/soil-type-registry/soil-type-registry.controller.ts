import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SoilTypeRegistryService } from './soil-type-registry.service';
import { CreateSoilTypeDto } from './dto/create-soil-type.dto';
import { UpdateSoilTypeDto } from './dto/update-soil-type.dto';

@Controller('soil-types')
export class SoilTypeRegistryController {
  constructor(private readonly soilTypeService: SoilTypeRegistryService) {}

  @Post()
  create(@Body() dto: CreateSoilTypeDto) {
    return this.soilTypeService.create(dto);
  }

  @Get()
  findAll() {
    return this.soilTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soilTypeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSoilTypeDto) {
    return this.soilTypeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soilTypeService.remove(id);
  }

  @Post('classify')
  classify(@Body() dto: CreateSoilTypeDto) {
    return this.soilTypeService.classify(dto);
  }
}
