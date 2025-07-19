import { Procurement } from 'src/procurement/entities/procurement.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'farmer' })
  role: string;

  @OneToMany(() => Procurement, (procurement) => procurement.owner)
  procurements: Procurement[];
}
