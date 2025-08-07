import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType, TransactionStatus } from '../../shared/enums';
import { Payment } from './payment.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payment_id' })
  paymentId: string;

  @Column({ name: 'transaction_reference', unique: true })
  transactionReference: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'currency_code', default: 'USD' })
  currencyCode: string;

  @Column({ name: 'gateway_reference', nullable: true })
  gatewayReference: string;

  @Column({ name: 'gateway_response', type: 'jsonb', nullable: true })
  gatewayResponse: Record<string, any>;

  @Column({
    name: 'processing_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  processingFee: number;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string;

  @Column({ name: 'processed_at', nullable: true })
  processedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Payment, (payment) => payment.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  // Virtual properties
  get isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  get isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  get isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  get isRefund(): boolean {
    return this.type === TransactionType.REFUND;
  }

  get isCharge(): boolean {
    return this.type === TransactionType.CHARGE;
  }

  get netAmount(): number {
    return this.amount - this.processingFee;
  }
}
