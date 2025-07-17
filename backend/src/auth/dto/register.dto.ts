import { IsString, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsIn(['farmer', 'admin'])
  role?: string;
}
