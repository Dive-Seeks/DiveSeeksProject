import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CartStatus } from '../../shared/enums';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { Branch } from './branch.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'branch_id' })
  branchId: string;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'special_instructions', nullable: true })
  specialInstructions: string;

  @Column({ type: 'jsonb', nullable: true })
  customizations: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  modifiers: Record<string, any>;

  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.ACTIVE })
  status: CartStatus;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  // Virtual properties
  get subtotal(): number {
    return this.quantity * this.unitPrice;
  }

  get isExpired(): boolean {
    return this.expiresAt && this.expiresAt < new Date();
  }

  get isActive(): boolean {
    return this.status === CartStatus.ACTIVE && !this.isExpired;
  }

  get hasCustomizations(): boolean {
    return this.customizations && Object.keys(this.customizations).length > 0;
  }

  get hasModifiers(): boolean {
    return this.modifiers && Object.keys(this.modifiers).length > 0;
  }
}
