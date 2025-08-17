import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationSchedulerController } from './notification-scheduler.controller';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationSchedulerService],
  controllers: [NotificationSchedulerController],
  exports: [NotificationSchedulerService],
})
export class NotificationSchedulerModule {}
