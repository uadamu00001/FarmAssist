
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Controller('notifications')
export class NotificationSchedulerController {
  constructor(private readonly svc: NotificationSchedulerService) {}


  @Get()
  list() {
    return this.svc.list();
  }

  @Get('status')
  async status() {
    // Return counts for each status and retry metricss
    const all = await this.svc.list();
    const statusCounts = all.reduce((acc, n) => {
      acc[n.status] = (acc[n.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const avgRetries =
      all.length > 0
        ? all.reduce((sum, n) => sum + (n.retryCount || 0), 0) / all.length
        : 0;
    return {
      total: all.length,
      statusCounts,
      avgRetries,
      timestamp: new Date().toISOString(),
    };
  }


  @Get(':id')
  async get(@Param('id') id: string) {
    const i = Number(id);
    const all = await this.svc.list();
    return all.find((n) => n.id === i) ?? null;
  }


  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    const n = await this.svc.schedule({
      to: dto.to,
      channel: dto.channel,
      subject: dto.subject,
      body: dto.body,
      sendAt: new Date(dto.sendAt),
      retryCount: 0,
      maxRetries: 3,
      lastErrorCode: 0,
      lastErrorMessage: null,
      recurrence: dto.recurrence ?? 'none',
      recurrenceEnd: dto.recurrenceEnd ? new Date(dto.recurrenceEnd) : null,
    });
    return n;
  }

  //delete
  @Delete(':id')
  async cancel(@Param('id') id: string) {
    const i = Number(id);
    return this.svc.cancel(i);
  }
}
