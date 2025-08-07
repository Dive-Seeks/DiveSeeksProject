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
import { Branch } from './branch.entity';
import { Category } from './category.entity';
import { StockItem } from './stock-item.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from './cart-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'branch_id' })
  branchId: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  costPrice: number;

  @Column({
    name: 'compare_at_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  compareAtPrice: number;

  @Column({
    name: 'tax_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  taxRate: number;

  @Column({ name: 'image_urls', type: 'jsonb', nullable: true })
  imageUrls: string[];

  @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  weight: number;

  @Column({ name: 'weight_unit', nullable: true })
  weightUnit: string;

  @Column({ type: 'jsonb', nullable: true })
  dimensions: Record<string, any>;

  @Column({ name: 'track_inventory', default: true })
  trackInventory: boolean;

  @Column({ name: 'allow_backorder', default: false })
  allowBackorder: boolean;

  @Column({ name: 'requires_shipping', default: true })
  requiresShipping: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'meta_title', nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', nullable: true })
  metaDescription: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  variants: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Branch, (branch) => branch.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => StockItem, (stockItem) => stockItem.product)
  stockItems: StockItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  // Virtual properties
  get isOnSale(): boolean {
    return this.compareAtPrice && this.compareAtPrice > this.price;
  }

  get discountPercentage(): number {
    if (!this.isOnSale) return 0;
    return Math.round(
      ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100,
    );
  }

  get priceWithTax(): number {
    return this.price * (1 + this.taxRate / 100);
  }

  get isAvailable(): boolean {
    return this.isActive;
  }
}
