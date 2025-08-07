import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockStatus } from '../../shared/enums';
import { Product } from './product.entity';

@Entity('stock_items')
export class StockItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'quantity_on_hand', default: 0 })
  quantityOnHand: number;

  @Column({ name: 'quantity_reserved', default: 0 })
  quantityReserved: number;

  @Column({ name: 'quantity_available', default: 0 })
  quantityAvailable: number;

  @Column({ name: 'reorder_point', default: 0 })
  reorderPoint: number;

  @Column({ name: 'reorder_quantity', default: 0 })
  reorderQuantity: number;

  @Column({ name: 'max_stock_level', nullable: true })
  maxStockLevel: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  unitCost: number;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalValue: number;

  @Column({ name: 'last_counted_at', nullable: true })
  lastCountedAt: Date;

  @Column({ name: 'last_received_at', nullable: true })
  lastReceivedAt: Date;

  @Column({ name: 'last_sold_at', nullable: true })
  lastSoldAt: Date;

  @Column({ type: 'enum', enum: StockStatus, default: StockStatus.IN_STOCK })
  status: StockStatus;

  @Column({ name: 'location_code', nullable: true })
  locationCode: string;

  @Column({ name: 'batch_number', nullable: true })
  batchNumber: string;

  @Column({ name: 'expiry_date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  notes: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, (product) => product.stockItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Virtual properties
  get isLowStock(): boolean {
    return this.quantityAvailable <= this.reorderPoint;
  }

  get isOutOfStock(): boolean {
    return this.quantityAvailable <= 0;
  }

  get isOverStock(): boolean {
    return this.maxStockLevel && this.quantityOnHand > this.maxStockLevel;
  }

  get isExpired(): boolean {
    return this.expiryDate && this.expiryDate < new Date();
  }

  get isExpiringSoon(): boolean {
    if (!this.expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.expiryDate <= thirtyDaysFromNow;
  }

  get stockValue(): number {
    return this.unitCost ? this.quantityOnHand * this.unitCost : 0;
  }
}
