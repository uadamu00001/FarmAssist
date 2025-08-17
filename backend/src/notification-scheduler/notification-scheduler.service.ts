
import { Injectable, Logger } from '@nestjs/common';
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

    setTimeout(async () => {
      // refetch from DB in case status changed
      const current = await this.notificationRepo.findOneBy({ id: n.id });
      if (!current || current.status !== 'scheduled') return;

      try {
        let res;
        if (current.channel === 'email') {
          res = await sendEmail(current.to, current.subject, current.body);
        } else {
          res = await sendSms(current.to, current.body);
        }

        if (res && (res as any).ok) {
          current.status = 'sent';
          this.logger.log(`Notification ${current.id} sent (${current.channel}) to ${current.to}`);
        } else {
          current.status = 'failed';
          this.logger.warn(`Notification ${current.id} failed to send: ${JSON.stringify(res)}`);
        }
      } catch (err) {
        current.status = 'failed';
        this.logger.error(`Notification ${current.id} send error`, err as any);
      }

      await this.notificationRepo.save(current);
    }, delay);
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
