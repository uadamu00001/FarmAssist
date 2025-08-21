import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EquipmentType } from '../enums/equipment-type.enum';
import { ListingStatus } from '../enums/listing-status.enum';

@Entity('equipment_listings')
@Index(['name', 'location', 'type', 'status'])
export class EquipmentListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: EquipmentType })
  type: EquipmentType;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 3 })
  currency: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.AVAILABLE })
  status: ListingStatus;

  @Column({ default: false })
  forRent: boolean;

  @Column({ default: false })
  forSale: boolean;

  @Column('text', { nullable: true })
  description?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


