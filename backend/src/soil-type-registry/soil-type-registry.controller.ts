  /**
   * Suggest crops based on soil properties.
   */
  @Post('suggest-crops')
  @ApiOperation({ summary: 'Suggest crops based on soil properties' })
  @ApiBody({ type: CreateSoilTypeDto })
  @ApiResponse({ status: 200, description: 'Suggested crops.' })
  suggestCrops(@Body() dto: CreateSoilTypeDto) {
    return this.soilTypeService.suggestCrops(dto);
  }

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SoilTypeRegistryService } from './soil-type-registry.service';
import { CreateSoilTypeDto } from './dto/create-soil-type.dto';
import { UpdateSoilTypeDto } from './dto/update-soil-type.dto';

/**
 * Controller for managing soil types and classification.
 */
@ApiTags('Soil Types')
@Controller('soil-types')
export class SoilTypeRegistryController {
  constructor(private readonly soilTypeService: SoilTypeRegistryService) {}

  /**
   * Create a new soil type entry.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new soil type' })
  @ApiBody({ type: CreateSoilTypeDto })
  @ApiResponse({ status: 201, description: 'Soil type created.' })
  create(@Body() dto: CreateSoilTypeDto) {
    return this.soilTypeService.create(dto);
  }

  /**
   * Get all soil types.
   */
  @Get()
  @ApiOperation({ summary: 'Get all soil types' })
  @ApiResponse({ status: 200, description: 'List of soil types.' })
  findAll() {
    return this.soilTypeService.findAll();
  }

  /**
   * Get a soil type by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get soil type by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Soil type found.' })
  findOne(@Param('id') id: string) {
    return this.soilTypeService.findOne(id);
  }

  /**
   * Update a soil type by ID.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update soil type by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateSoilTypeDto })
  @ApiResponse({ status: 200, description: 'Soil type updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateSoilTypeDto) {
    return this.soilTypeService.update(id, dto);
  }

  /**
   * Delete a soil type by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete soil type by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Soil type deleted.' })
  remove(@Param('id') id: string) {
    return this.soilTypeService.remove(id);
  }

  /**
   * Classify a soil type based on its properties.
   */
  @Post('classify')
  @ApiOperation({ summary: 'Classify a soil type' })
  @ApiBody({ type: CreateSoilTypeDto })
  @ApiResponse({ status: 200, description: 'Classification result.' })
  classify(@Body() dto: CreateSoilTypeDto) {
    return this.soilTypeService.classify(dto);
  }

  /**
   * Filter soil types by pH range.
   */
  @Get('filter/ph')
  @ApiOperation({ summary: 'Filter soil types by pH range' })
  @ApiQuery({ name: 'min', type: Number })
  @ApiQuery({ name: 'max', type: Number })
  filterByPhRange(@Body() body: { min: number; max: number }) {
    return this.soilTypeService.filterByPhRange(body.min, body.max);
  }

  /**
   * Filter soil types by drainage.
   */
  @Get('filter/drainage/:drainage')
  @ApiOperation({ summary: 'Filter soil types by drainage' })
  @ApiParam({ name: 'drainage', enum: ['poor', 'moderate', 'excellent'] })
  filterByDrainage(@Param('drainage') drainage: 'poor' | 'moderate' | 'excellent') {
    return this.soilTypeService.filterByDrainage(drainage);
  }

  /**
   * Filter soil types by compatible crop.
   */
  @Get('filter/crop/:crop')
  @ApiOperation({ summary: 'Filter soil types by compatible crop' })
  @ApiParam({ name: 'crop', type: String })
  filterByCrop(@Param('crop') crop: string) {
    return this.soilTypeService.filterByCrop(crop);
  }
}
