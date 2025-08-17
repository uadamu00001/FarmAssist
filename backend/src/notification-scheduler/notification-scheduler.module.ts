import { Module } from '@nestjs/common';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationSchedulerController } from './notification-scheduler.controller';

@Module({
  providers: [NotificationSchedulerService],
  controllers: [NotificationSchedulerController],
  exports: [NotificationSchedulerService],
})
export class NotificationSchedulerModule {}
