import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AnimalFeedService } from './animal-feed.service';
import { CreateAnimalFeedDto } from './dto/create-animal-feed.dto';
import { UpdateAnimalFeedDto } from './dto/update-animal-feed.dto';

@Controller('animal-feed')
export class AnimalFeedController {
  constructor(private readonly service: AnimalFeedService) {}

  @Post()
  create(@Body() dto: CreateAnimalFeedDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnimalFeedDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
