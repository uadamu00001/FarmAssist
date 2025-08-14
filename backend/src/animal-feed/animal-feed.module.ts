import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalFeed } from './animal-feed.entity';
import { AnimalFeedService } from './animal-feed.service';
import { AnimalFeedController } from './animal-feed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnimalFeed])],
  controllers: [AnimalFeedController],
  providers: [AnimalFeedService],
  exports: [AnimalFeedService],
})
export class AnimalFeedModule {}
