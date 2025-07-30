import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class InventoryStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  farmerId: number;

  @Column()
  inputType: string; // e.g., 'fertilizer', 'seed packets'

  @Column('float')
  quantity: number;

  @Column({ nullable: true })
  unit: string; // e.g., 'kg', 'packets'

  @Column({ nullable: true })
  lastUpdated: Date;
}
