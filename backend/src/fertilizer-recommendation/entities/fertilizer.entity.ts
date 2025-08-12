import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fertilizers')
export class Fertilizer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cropType: string;

  @Column()
  soilType: string;

  @Column()
  description: string;
}
