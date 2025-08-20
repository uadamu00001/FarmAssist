import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InputPriceTrackerService } from './input-price-tracker.service';
import { CreateInputPriceDto } from './dto/create-input-price.dto';
import { UpdateInputPriceDto } from './dto/update-input-price.dto';
import { QueryPriceHistoryDto } from './dto/query-price-history.dto';

@ApiTags('input-prices')
@Controller('input-prices')
export class InputPriceTrackerController {
  constructor(private readonly service: InputPriceTrackerService) {}

  @Post()
  create(@Body() dto: CreateInputPriceDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  bulkCreate(@Body() dtos: CreateInputPriceDto[]) {
    return this.service.bulkCreate(dtos);
  }

  @Get()
  findAll(@Query() query: QueryPriceHistoryDto) {
    return this.service.findAll(query);
  }

  @Get('trends')
  getTrends(@Query() query: QueryPriceHistoryDto) {
    return this.service.getTrends(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateInputPriceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}


