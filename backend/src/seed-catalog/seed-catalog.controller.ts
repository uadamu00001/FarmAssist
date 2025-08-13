import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SeedCatalogService } from './seed-catalog.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';

@Controller('seed-catalog')
export class SeedCatalogController {
  constructor(private readonly seedCatalogService: SeedCatalogService) {}

  @Post()
  create(@Body() createSeedDto: CreateSeedDto) {
    return this.seedCatalogService.create(createSeedDto);
  }

  @Get()
  findAll() {
    return this.seedCatalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.seedCatalogService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeedDto: UpdateSeedDto,
  ) {
    return this.seedCatalogService.update(id, updateSeedDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.seedCatalogService.remove(id);
  }
}
