
import { IsISO8601, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsIn(['email', 'sms'])
  channel: 'email' | 'sms';

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  // ISO 8601 timestamp in the future
  @IsISO8601()
  sendAt: string;

  @IsOptional()
  @IsIn(['none', 'daily', 'weekly', 'monthly'])
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';

  @IsOptional()
  @IsISO8601()
  recurrenceEnd?: string;
}
