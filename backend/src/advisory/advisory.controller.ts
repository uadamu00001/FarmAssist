import { Controller, Get, Query } from '@nestjs/common';
import { AdvisoryService } from './advisory.service';
import { Advisory } from './entities/advisory.entity';

@Controller('advisory')
export class AdvisoryController {
  constructor(private readonly advisoryService: AdvisoryService) {}

  @Get()
  getAdvisories(
    @Query('type') type?: string,
    @Query('region') region?: string,
    @Query('language') language?: string,
  ): Advisory[] {
    return this.advisoryService.findAll(type, region, language);
  }
}
