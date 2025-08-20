import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InputType } from '../enums/input-type.enum';
import { PriceFrequency } from '../enums/price-frequency.enum';

@Entity('input_prices')
@Index('uniq_input_price_per_period', [
  'inputType',
  'itemName',
  'supplierName',
  'currency',
  'unit',
  'frequency',
  'effectiveDate',
], { unique: true })
export class InputPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: InputType, name: 'input_type' })
  inputType: InputType;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column({ name: 'supplier_name' })
  supplierName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 3 })
  currency: string;

  @Column()
  unit: string;

  @Column({ type: 'enum', enum: PriceFrequency })
  frequency: PriceFrequency;

  // ISO date string (YYYY-MM-DD).
  @Column({ type: 'date', name: 'effective_date' })
  effectiveDate: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


