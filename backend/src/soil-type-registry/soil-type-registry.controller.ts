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

  @Get('filter/ph')
  filterByPhRange(@Body() body: { min: number; max: number }) {
    return this.soilTypeService.filterByPhRange(body.min, body.max);
  }

  @Get('filter/drainage/:drainage')
  filterByDrainage(@Param('drainage') drainage: 'poor' | 'moderate' | 'excellent') {
    return this.soilTypeService.filterByDrainage(drainage);
  }

  @Get('filter/crop/:crop')
  filterByCrop(@Param('crop') crop: string) {
    return this.soilTypeService.filterByCrop(crop);
  }
}
