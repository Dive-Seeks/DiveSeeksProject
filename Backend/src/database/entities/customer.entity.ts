import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { CartItem } from './cart-item.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'default_address', type: 'jsonb', nullable: true })
  defaultAddress: Record<string, any>;

  @Column({ name: 'saved_addresses', type: 'jsonb', nullable: true })
  savedAddresses: Record<string, any>[];

  @Column({ name: 'preferences', type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @Column({ name: 'dietary_restrictions', type: 'jsonb', nullable: true })
  dietaryRestrictions: string[];

  @Column({ name: 'loyalty_points', default: 0 })
  loyaltyPoints: number;

  @Column({
    name: 'total_spent',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalSpent: number;

  @Column({ name: 'total_orders', default: 0 })
  totalOrders: number;

  @Column({
    name: 'average_order_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  averageOrderValue: number;

  @Column({ name: 'last_order_date', nullable: true })
  lastOrderDate: Date;

  @Column({ name: 'marketing_consent', default: false })
  marketingConsent: boolean;

  @Column({ name: 'sms_consent', default: false })
  smsConsent: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  notes: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.customer)
  cartItems: CartItem[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isVip(): boolean {
    return this.totalSpent >= 1000 || this.totalOrders >= 50;
  }

  get isNewCustomer(): boolean {
    return this.totalOrders === 0;
  }

  get daysSinceLastOrder(): number {
    if (!this.lastOrderDate) return Infinity;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.lastOrderDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isReturningCustomer(): boolean {
    return this.totalOrders > 1;
  }

  get customerSegment(): string {
    if (this.isNewCustomer) return 'new';
    if (this.isVip) return 'vip';
    if (this.daysSinceLastOrder > 90) return 'inactive';
    if (this.totalOrders >= 10) return 'loyal';
    return 'regular';
  }
}
