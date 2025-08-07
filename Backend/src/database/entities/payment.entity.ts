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
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from '../../shared/enums';
import { Order } from './order.entity';
import { Transaction } from './transaction.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'payment_reference', unique: true })
  paymentReference: string;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'currency_code', default: 'USD' })
  currencyCode: string;

  @Column({
    name: 'exchange_rate',
    type: 'decimal',
    precision: 10,
    scale: 4,
    default: 1,
  })
  exchangeRate: number;

  @Column({
    name: 'processing_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  processingFee: number;

  @Column({ name: 'gateway_reference', nullable: true })
  gatewayReference: string;

  @Column({ name: 'gateway_response', type: 'jsonb', nullable: true })
  gatewayResponse: Record<string, any>;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string;

  @Column({
    name: 'refund_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  refundAmount: number;

  @Column({ name: 'refund_reason', nullable: true })
  refundReason: string;

  @Column({ name: 'authorized_at', nullable: true })
  authorizedAt: Date;

  @Column({ name: 'captured_at', nullable: true })
  capturedAt: Date;

  @Column({ name: 'failed_at', nullable: true })
  failedAt: Date;

  @Column({ name: 'refunded_at', nullable: true })
  refundedAt: Date;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToMany(() => Transaction, (transaction) => transaction.payment)
  transactions: Transaction[];

  // Virtual properties
  get isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  get isAuthorized(): boolean {
    return this.status === TransactionStatus.AUTHORIZED;
  }

  get isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  get isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  get isRefunded(): boolean {
    return this.status === TransactionStatus.REFUNDED;
  }

  get isCancelled(): boolean {
    return this.status === TransactionStatus.CANCELLED;
  }

  get isExpired(): boolean {
    return this.expiresAt && this.expiresAt < new Date();
  }

  get netAmount(): number {
    return this.amount - this.processingFee;
  }

  get remainingRefundAmount(): number {
    return Math.max(0, this.amount - this.refundAmount);
  }

  get canBeRefunded(): boolean {
    return this.isCompleted && this.remainingRefundAmount > 0;
  }
}
