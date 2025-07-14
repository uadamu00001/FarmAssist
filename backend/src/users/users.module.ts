import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 connect entity here
  exports: [TypeOrmModule], // 👈 allow other modules to inject User repo
})
export class UsersModule {}
