import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('seeds')
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cropType: string;

  @Column('decimal', { precision: 5, scale: 2 })
  germinationRate: number; // percentage e.g. 85.50

  @Column('text', { array: true })
  recommendedSeasons: string[]; // e.g. ['Spring', 'Summer']

  @Column('text', { array: true })
  suppliers: string[]; // supplier names or IDs
}
