import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationSchedulerController {
  constructor(private readonly svc: NotificationSchedulerService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    const i = Number(id);
    return this.svc.list().find((n) => n.id === i) ?? null;
  }

  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    const n = await this.svc.schedule({
      to: dto.to,
      channel: dto.channel,
      subject: dto.subject,
      body: dto.body,
      sendAt: dto.sendAt,
    });
    return n;
  }

  @Delete(':id')
  async cancel(@Param('id') id: string) {
    const i = Number(id);
    return this.svc.cancel(i);
  }
}
