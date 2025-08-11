import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'weather_snapshots' })
export class WeatherSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // optional: link to a farm or location in your system
  @Column({ type: 'varchar', nullable: true })
  @Index()
  farmId?: string | null;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lon: number;

  @Column({ type: 'double precision', nullable: true })
  temperature?: number | null;

  @Column({ type: 'int', nullable: true })
  humidity?: number | null;

  @Column({ type: 'jsonb', nullable: true })
  raw?: any;

  @Column({ type: 'timestamptz', nullable: true })
  fetchedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
