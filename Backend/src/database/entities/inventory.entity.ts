import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Branch } from './branch.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'branch_id' })
  branchId: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'min_stock_level', type: 'int', default: 0 })
  minStockLevel: number;

  @Column({ name: 'max_stock_level', type: 'int', nullable: true })
  maxStockLevel: number;

  @Column({ name: 'reorder_point', type: 'int', default: 0 })
  reorderPoint: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  unitCost: number;

  @Column({ name: 'last_restocked_at', nullable: true })
  lastRestockedAt: Date;

  @Column({ name: 'last_sold_at', nullable: true })
  lastSoldAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Branch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  // Virtual properties
  get isLowStock(): boolean {
    return this.quantity <= this.reorderPoint;
  }

  get isOutOfStock(): boolean {
    return this.quantity === 0;
  }

  get stockValue(): number {
    return this.quantity * this.unitCost;
  }
}
