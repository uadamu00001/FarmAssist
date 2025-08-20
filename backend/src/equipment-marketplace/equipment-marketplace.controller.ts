import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEquipmentListingDto } from './dto/create-equipment-listing.dto';
import { QueryEquipmentListingsDto } from './dto/query-equipment-listings.dto';
import { UpdateEquipmentListingDto } from './dto/update-equipment-listing.dto';
import { EquipmentMarketplaceService } from './equipment-marketplace.service';

@ApiTags('equipment-marketplace')
@Controller('equipment-marketplace')
export class EquipmentMarketplaceController {
  constructor(private readonly service: EquipmentMarketplaceService) {}

  @Post()
  @ApiOperation({ summary: 'Create an equipment listing (sale or rent)' })
  @ApiResponse({ status: 201, description: 'Listing created' })
  create(@Body() dto: CreateEquipmentListingDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List equipment with filters and pagination' })
  findAll(@Query() query: QueryEquipmentListingsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single listing' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a listing' })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateEquipmentListingDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a listing' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}


