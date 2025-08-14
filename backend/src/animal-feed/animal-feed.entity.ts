import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('animal_feeds')
export class AnimalFeed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  // Store macro/micro nutrients flexibly
  @Column({ type: 'jsonb', nullable: true })
  nutrition?: Record<string, any> | null;

  // Recommended animal species e.g., ["cattle", "sheep"]
  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  recommendedSpecies: string[];

  // Storage requirements like temperature, humidity, shelf life, etc.
  @Column({ type: 'jsonb', nullable: true })
  storageRequirements?: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
