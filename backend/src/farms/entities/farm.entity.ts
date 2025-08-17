import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cropType: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  sizeInAcres: number;

  @ManyToOne(() => User, (user) => user.farms)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;
}
