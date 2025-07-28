import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferencesDto } from './dto/create-user-preferences.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';

@Controller('preferences')
export class UserPreferencesController {
  constructor(private readonly service: UserPreferencesService) {}

  @Post()
  create(@Body() dto: CreateUserPreferencesDto) {
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

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserPreferencesDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
