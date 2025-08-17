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
}
