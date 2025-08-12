import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('farm_profiles')
export class FarmProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  farmSize: number; // hectares

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column()
  cropType: string;

  @Column()
  farmerName: string;

  @Column()
  farmerContact: string;
}
