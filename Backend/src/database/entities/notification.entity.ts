import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NotificationType, NotificationChannel } from '../../shared/enums';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'recipient_email', nullable: true })
  recipientEmail: string;

  @Column({ name: 'recipient_phone', nullable: true })
  recipientPhone: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ name: 'template_id', nullable: true })
  templateId: string;

  @Column({ name: 'template_variables', type: 'jsonb', nullable: true })
  templateVariables: Record<string, any>;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', nullable: true })
  readAt: Date;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  @Column({ name: 'sent_at', nullable: true })
  sentAt: Date;

  @Column({ name: 'failed_at', nullable: true })
  failedAt: Date;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @Column({ name: 'max_retries', default: 3 })
  maxRetries: number;

  @Column({ name: 'scheduled_for', nullable: true })
  scheduledFor: Date;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date;

  @Column({ name: 'external_id', nullable: true })
  externalId: string;

  @Column({ name: 'external_response', type: 'jsonb', nullable: true })
  externalResponse: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Virtual properties
  get isPending(): boolean {
    return !this.isSent && !this.failedAt;
  }

  get isScheduled(): boolean {
    return this.scheduledFor && this.scheduledFor > new Date();
  }

  get isExpired(): boolean {
    return this.expiresAt && this.expiresAt < new Date();
  }

  get canRetry(): boolean {
    return this.failedAt && this.retryCount < this.maxRetries;
  }

  get isDelivered(): boolean {
    return this.isSent && !this.failedAt;
  }

  get isEmail(): boolean {
    return this.channel === NotificationChannel.EMAIL;
  }

  get isSms(): boolean {
    return this.channel === NotificationChannel.SMS;
  }

  get isPush(): boolean {
    return this.channel === NotificationChannel.PUSH;
  }

  get isInApp(): boolean {
    return this.channel === NotificationChannel.IN_APP;
  }
}
