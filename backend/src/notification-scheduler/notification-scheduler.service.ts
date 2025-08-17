import { Injectable, Logger } from '@nestjs/common';
import { Notification } from './notification.entity';
import { sendEmail } from './providers/email.provider';
import { sendSms } from './providers/sms.provider';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);
  private store = new Map<number, Notification>();
  private nextId = 1;

  constructor() {}

  list() {
    return Array.from(this.store.values()).sort((a, b) => a.id - b.id);
  }

  async schedule(notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) {
    const id = this.nextId++;
    const createdAt = new Date().toISOString();
    const notif: Notification = {
      id,
      ...notification,
      createdAt,
      status: 'scheduled',
    };

    this.store.set(id, notif);
    this.setupTimer(notif).catch((e) => this.logger.error(e));
    return notif;
  }

  async cancel(id: number) {
    const n = this.store.get(id);
    if (!n) return null;
    if (n.status !== 'scheduled') return n;
    n.status = 'cancelled';
    this.store.set(id, n);
    return n;
  }

  private async setupTimer(n: Notification) {
    const sendAt = new Date(n.sendAt).getTime();
    const now = Date.now();
    const delay = Math.max(0, sendAt - now);

    // schedule
    setTimeout(async () => {
      // if cancelled meanwhile
      const current = this.store.get(n.id);
      if (!current || current.status !== 'scheduled') return;

      try {
        let res;
        if (n.channel === 'email') {
          res = await sendEmail(n.to, n.subject, n.body);
        } else {
          res = await sendSms(n.to, n.body);
        }

        if (res && (res as any).ok) {
          current.status = 'sent';
          this.logger.log(`Notification ${n.id} sent (${n.channel}) to ${n.to}`);
        } else {
          current.status = 'failed';
          this.logger.warn(`Notification ${n.id} failed to send: ${JSON.stringify(res)}`);
        }
      } catch (err) {
        current.status = 'failed';
        this.logger.error(`Notification ${n.id} send error`, err as any);
      }

      this.store.set(n.id, current);
    }, delay);
  }
}
