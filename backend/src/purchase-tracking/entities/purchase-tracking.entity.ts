// src/purchase-recording/entities/purchase-record.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('purchase_records')
export class PurchaseRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'transaction_id', unique: true })
  transactionId: string;

  @Column('jsonb')
  items: PurchaseItem[];

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod?: string;

  @Column({ name: 'purchase_status', default: 'completed' })
  status: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  sku?: string;
}