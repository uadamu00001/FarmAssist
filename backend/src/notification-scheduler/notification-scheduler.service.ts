
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Not, MoreThan } from 'typeorm';
import { Notification } from './notification.entity';
import { sendEmail } from './providers/email.provider';
import { sendSms } from './providers/sms.provider';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly configService: ConfigService,
  ) {
    // On service start, schedule all pending notifications
    this.rescheduleAllPending();
  }

  async list() {
    return this.notificationRepo.find({ order: { id: 'ASC' } });
  }

  async schedule(notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) {
    const notif = this.notificationRepo.create({
      ...notification,
      status: 'scheduled',
    });
    const saved = await this.notificationRepo.save(notif);
    this.setupTimer(saved).catch((e) => this.logger.error(e));
    return saved;
  }

  async cancel(id: number) {
    const n = await this.notificationRepo.findOneBy({ id });
    if (!n) return null;
    if (n.status !== 'scheduled') return n;
    n.status = 'cancelled';
    await this.notificationRepo.save(n);
    return n;
  }

  private async setupTimer(n: Notification) {
    const sendAt = new Date(n.sendAt).getTime();
    const now = Date.now();
    const delay = Math.max(0, sendAt - now);

    this.logger.log(`Scheduling notification ${n.id} (status: ${n.status}, recurrence: ${n.recurrence}) to run in ${Math.round(delay / 1000)}s`);

  const retryDelay = this.configService.get<number>('NOTIFICATION_RETRY_DELAY_MS', 30000);
  setTimeout(async () => {
      // refetch from DB in case status changed
      let current = await this.notificationRepo.findOneBy({ id: n.id });
      if (!current || current.status !== 'scheduled') {
        this.logger.warn(`Notification ${n.id} not sent: status is now ${current?.status}`);
        return;
      }

      try {
        let res;
        if (current.channel === 'email') {
          this.logger.log(`Attempting to send EMAIL notification ${current.id} to ${current.to}`);
          res = await sendEmail(current.to, current.subject, current.body);
        } else {
          this.logger.log(`Attempting to send SMS notification ${current.id} to ${current.to}`);
          res = await sendSms(current.to, current.body);
        }

        if (res && (res as any).ok) {
          current.status = 'sent';
          current.lastErrorCode = 0;
          current.lastErrorMessage = null;
          this.logger.log(`Notification ${current.id} sent (${current.channel}) to ${current.to}`);

          // Recurring support: schedule next occurrence if needed
          if (current.recurrence && current.recurrence !== 'none') {
            const nextDate = this.getNextRecurrence(current.sendAt, current.recurrence);
            if (
              nextDate &&
              (!current.recurrenceEnd || nextDate <= current.recurrenceEnd)
            ) {
              this.logger.log(`Rescheduling recurring notification ${current.id} for ${nextDate.toISOString()}`);
              // Reset status and retry fields for next occurrence
              current.status = 'scheduled';
              current.retryCount = 0;
              current.sendAt = nextDate;
              await this.notificationRepo.save(current);
              this.setupTimer(current);
              return;
            }
          }
        } else {
          // failed, retry if possible
          current.retryCount = (current.retryCount || 0) + 1;
          current.lastErrorCode = 1;
          current.lastErrorMessage = JSON.stringify(res);
          if (current.retryCount < (current.maxRetries || 3)) {
            this.logger.warn(`Notification ${current.id} failed to send, retrying (${current.retryCount}/${current.maxRetries}): ${current.lastErrorMessage}`);
            await this.notificationRepo.save(current);
            // retry after 30 seconds
            setTimeout(() => this.setupTimer(current), retryDelay);
            return;
          } else {
            current.status = 'failed';
            this.logger.warn(`Notification ${current.id} failed after max retries: ${current.lastErrorMessage}`);
          }
        }
      } catch (err) {
        current.retryCount = (current.retryCount || 0) + 1;
        current.lastErrorCode = 2;
        current.lastErrorMessage = (err as any)?.message || String(err);
        if (current.retryCount < (current.maxRetries || 3)) {
          this.logger.warn(`Notification ${current.id} send error, retrying (${current.retryCount}/${current.maxRetries}): ${current.lastErrorMessage}`);
          await this.notificationRepo.save(current);
          setTimeout(() => this.setupTimer(current), retryDelay);
          return;
        } else {
          current.status = 'failed';
          this.logger.error(`Notification ${current.id} send error after max retries: ${current.lastErrorMessage}`);
        }
      }

      await this.notificationRepo.save(current);
    }, delay);
  }

  // Calculate next recurrence date
  private getNextRecurrence(date: Date, recurrence: string): Date | null {
    const d = new Date(date);
    switch (recurrence) {
      case 'daily':
        d.setDate(d.getDate() + 1);
        return d;
      case 'weekly':
        d.setDate(d.getDate() + 7);
        return d;
      case 'monthly':
        d.setMonth(d.getMonth() + 1);
        return d;
      default:
        return null;
    }
  }

  // On service start, reschedule all scheduled notifications in the future
  private async rescheduleAllPending() {
    const now = new Date();
    const scheduled = await this.notificationRepo.find({
      where: {
        status: 'scheduled',
        sendAt: MoreThan(now),
      },
    });
    scheduled.forEach((n) => this.setupTimer(n));
  }
}
