import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateUserPreferencesDto {
  @IsIn(['email', 'sms', 'push'])
  notificationType: 'email' | 'sms' | 'push';

  @IsIn(['top', 'center', 'bottom', 'left', 'right'])
  cropFocus: 'top' | 'center' | 'bottom' | 'left' | 'right';

  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  location?: string;
}
