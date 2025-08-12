import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { FarmProfileService } from './farm-profile.service';
import { CreateFarmProfileDto } from './dto/create-farm-profile.dto';
import { UpdateFarmProfileDto } from './dto/update-farm-profile.dto';

@Controller('farm-profiles')
export class FarmProfileController {
  constructor(private readonly farmProfileService: FarmProfileService) {}

  @Post()
  create(@Body() dto: CreateFarmProfileDto) {
    return this.farmProfileService.create(dto);
  }

  @Get()
  findAll() {
    return this.farmProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFarmProfileDto) {
    return this.farmProfileService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmProfileService.remove(id);
  }
}
