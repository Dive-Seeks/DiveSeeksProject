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
import { BusinessType, BusinessStatus } from '../../shared/enums';
import { User } from './user.entity';
import { Branch } from './branch.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @Column({ name: 'broker_id', nullable: true })
  brokerId: string;

  @Column()
  name: string;

  @Column({ name: 'business_type', type: 'enum', enum: BusinessType })
  businessType: BusinessType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'tax_number', nullable: true })
  taxNumber: string;

  @Column({ name: 'registration_number', nullable: true })
  registrationNumber: string;

  @Column({
    type: 'enum',
    enum: BusinessStatus,
    default: BusinessStatus.PENDING,
  })
  status: BusinessStatus;

  @Column({
    name: 'commission_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  commissionRate: number;

  @Column({ name: 'subscription_plan', nullable: true })
  subscriptionPlan: string;

  @Column({ name: 'subscription_expires_at', nullable: true })
  subscriptionExpiresAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'broker_id' })
  broker: User;

  @OneToMany(() => Branch, (branch) => branch.business)
  branches: Branch[];

  // Virtual properties
  get isSubscriptionActive(): boolean {
    return (
      this.subscriptionExpiresAt && this.subscriptionExpiresAt > new Date()
    );
  }

  get canOperate(): boolean {
    return (
      this.status === BusinessStatus.ACTIVE &&
      this.isActive &&
      this.isSubscriptionActive
    );
  }
}
