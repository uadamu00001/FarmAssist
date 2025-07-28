import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'email' })
  notificationType: 'email' | 'sms' | 'push';

  @Column({ default: 'center' })
  cropFocus: 'top' | 'center' | 'bottom' | 'left' | 'right';

  @Column({ default: 'en' })
  language: string;

  @Column({ nullable: true })
  location: string;
}
