import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InputPriceTrackerService } from './input-price-tracker.service';
import { CreateInputPriceDto } from './dto/create-input-price.dto';
import { UpdateInputPriceDto } from './dto/update-input-price.dto';
import { QueryPriceHistoryDto } from './dto/query-price-history.dto';

@ApiTags('input-prices')
@Controller('input-prices')
export class InputPriceTrackerController {
  constructor(private readonly service: InputPriceTrackerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a price entry for an input item' })
  @ApiResponse({ status: 201, description: 'Price entry created successfully' })
  @ApiResponse({ status: 409, description: 'Duplicate entry for given period' })
  create(@Body() dto: CreateInputPriceDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create price entries' })
  @ApiBody({ isArray: true, type: CreateInputPriceDto })
  @ApiResponse({ status: 201, description: 'Bulk creation result with counts' })
  bulkCreate(@Body() dtos: CreateInputPriceDto[]) {
    return this.service.bulkCreate(dtos);
  }

  @Get()
  @ApiOperation({ summary: 'List price entries with filters and pagination' })
  @ApiQuery({ name: 'inputType', required: false })
  @ApiQuery({ name: 'itemName', required: false })
  @ApiQuery({ name: 'supplierName', required: false })
  @ApiQuery({ name: 'currency', required: false })
  @ApiQuery({ name: 'frequency', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  findAll(@Query() query: QueryPriceHistoryDto) {
    return this.service.findAll(query);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get price trend time-series with aggregation' })
  @ApiQuery({ name: 'aggregate', required: false, description: 'avg|min|max' })
  getTrends(@Query() query: QueryPriceHistoryDto) {
    return this.service.getTrends(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single price entry by id' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a price entry by id' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiResponse({ status: 409, description: 'Duplicate entry after update' })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateInputPriceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a price entry by id' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}


