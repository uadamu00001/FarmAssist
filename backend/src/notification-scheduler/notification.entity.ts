import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type NotificationChannel = 'email' | 'sms';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column({ type: 'varchar' })
  channel: NotificationChannel;

  @Column({ nullable: true })
  subject?: string;

  @Column()
  body: string;

  @Column({ type: 'timestamptz' })
  sendAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'varchar', default: 'scheduled' })
  status: 'scheduled' | 'sent' | 'cancelled' | 'failed';

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'int', default: 3 })
  maxRetries: number;

  @Column({ type: 'int', default: 0 })
  lastErrorCode: number;

  @Column({ type: 'varchar', nullable: true })
  lastErrorMessage?: string;

  // Recurring ssupport: 'none', 'daily', 'weekly', 'monthly'
  @Column({ type: 'varchar', default: 'none' })
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';

  // If recurring, when to stop (null = forever)
  @Column({ type: 'timestamptz', nullable: true })
  recurrenceEnd?: Date;
}
