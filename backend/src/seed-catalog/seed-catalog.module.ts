import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedCatalogService } from './seed-catalog.service';
import { SeedCatalogController } from './seed-catalog.controller';
import { Seed } from './entities/seed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seed])],
  controllers: [SeedCatalogController],
  providers: [SeedCatalogService],
})
export class SeedCatalogModule {}
