import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_id' })
  businessId: string;

  @Column({ name: 'manager_id', nullable: true })
  managerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'address_line_1' })
  addressLine1: string;

  @Column({ name: 'address_line_2', nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column()
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ name: 'opening_hours', type: 'jsonb', nullable: true })
  openingHours: Record<string, any>;

  @Column({
    name: 'delivery_radius',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  deliveryRadius: number;

  @Column({
    name: 'delivery_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  deliveryFee: number;

  @Column({
    name: 'minimum_order',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  minimumOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'accepts_online_orders', default: true })
  acceptsOnlineOrders: boolean;

  @Column({ name: 'accepts_delivery', default: true })
  acceptsDelivery: boolean;

  @Column({ name: 'accepts_pickup', default: true })
  acceptsPickup: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Business, (business) => business.branches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @OneToMany(() => Product, (product) => product.branch)
  products: Product[];

  @OneToMany(() => Order, (order) => order.branch)
  orders: Order[];

  // Virtual properties
  get fullAddress(): string {
    const parts = [
      this.addressLine1,
      this.addressLine2,
      this.city,
      this.state,
      this.postalCode,
      this.country,
    ];
    return parts.filter(Boolean).join(', ');
  }

  get canAcceptOrders(): boolean {
    return this.isActive && this.acceptsOnlineOrders;
  }
}
