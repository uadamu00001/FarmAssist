export type NotificationChannel = 'email' | 'sms';

export interface Notification {
  id: number;
  to: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  sendAt: string; // ISO timestamp
  createdAt: string;
  status: 'scheduled' | 'sent' | 'cancelled' | 'failed';
}
