import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  farmId: string; // Foreign key to a Farm

  @Column()
  recommendationText: string;

  @Column('jsonb') // Store structured data like a list of inputs
  recommendedInputs: object;

  @CreateDateColumn()
  createdAt: Date;
}
