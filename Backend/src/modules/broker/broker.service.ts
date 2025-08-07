import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Business, Branch } from '../../database/entities';
import { UserRole, UserStatus } from '../../shared/enums';
import {
  CreateBusinessOwnerDto,
  UpdateBusinessOwnerDto,
  CreateBusinessDto,
  UpdateBusinessDto,
  UpdateBrokerProfileDto,
} from './dto';
import { UsersService } from '../users/users.service';
import { BusinessesService } from '../businesses/businesses.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BrokerService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private usersService: UsersService,
    private businessesService: BusinessesService,
  ) {}

  // Broker Profile Management
  async getBrokerProfile(brokerId: string): Promise<User> {
    const broker = await this.userRepository.findOne({
      where: { id: brokerId, role: UserRole.BROKER },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'avatarUrl',
        'status',
        'createdAt',
        'lastLoginAt',
      ],
    });

    if (!broker) {
      throw new NotFoundException('Broker not found');
    }

    return broker;
  }

  async updateBrokerProfile(
    brokerId: string,
    updateBrokerProfileDto: UpdateBrokerProfileDto,
  ): Promise<User> {
    const broker = await this.getBrokerProfile(brokerId);

    if (updateBrokerProfileDto.password) {
      const saltRounds = 10;
      updateBrokerProfileDto.password = await bcrypt.hash(
        updateBrokerProfileDto.password,
        saltRounds,
      );
    }

    Object.assign(broker, updateBrokerProfileDto);
    return await this.userRepository.save(broker);
  }

  // Business Owner Onboarding
  async createBusinessOwner(
    brokerId: string,
    createBusinessOwnerDto: CreateBusinessOwnerDto,
  ): Promise<User> {
    const { email, password, firstName, lastName, phone } =
      createBusinessOwnerDto;

    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create business owner
    const businessOwner = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      role: UserRole.BUSINESS_OWNER,
      status: UserStatus.ACTIVE,
    });

    return await this.userRepository.save(businessOwner);
  }

  async getMyBusinessOwners(brokerId: string): Promise<User[]> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    // Get businesses managed by this broker
    const businesses = await this.businessRepository.find({
      where: { brokerId },
      relations: ['owner'],
      select: {
        owner: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
        },
      },
    });

    return businesses
      .map((business) => business.owner)
      .filter((owner) => owner);
  }

  async getBusinessOwnerById(brokerId: string, ownerId: string): Promise<User> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    // Check if this business owner is managed by this broker
    const business = await this.businessRepository.findOne({
      where: { brokerId, ownerId },
      relations: ['owner'],
    });

    if (!business || !business.owner) {
      throw new NotFoundException(
        'Business owner not found or not managed by this broker',
      );
    }

    return business.owner;
  }

  async updateBusinessOwner(
    brokerId: string,
    ownerId: string,
    updateBusinessOwnerDto: UpdateBusinessOwnerDto,
  ): Promise<User> {
    const businessOwner = await this.getBusinessOwnerById(brokerId, ownerId);

    if (updateBusinessOwnerDto.password) {
      const saltRounds = 10;
      updateBusinessOwnerDto.password = await bcrypt.hash(
        updateBusinessOwnerDto.password,
        saltRounds,
      );
    }

    Object.assign(businessOwner, updateBusinessOwnerDto);
    return await this.userRepository.save(businessOwner);
  }

  // Business Management
  async createBusiness(
    brokerId: string,
    ownerId: string,
    createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    // Verify business owner exists and is managed by this broker
    await this.getBusinessOwnerById(brokerId, ownerId);

    // Create business
    const business = this.businessRepository.create({
      ...createBusinessDto,
      ownerId,
      brokerId,
      isActive: true,
    });

    return await this.businessRepository.save(business);
  }

  async getMyBusinesses(brokerId: string): Promise<Business[]> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    return await this.businessRepository.find({
      where: { brokerId },
      relations: ['owner', 'branches'],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        businessType: true,
        isActive: true,
        createdAt: true,
        owner: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
  }

  async getBusinessById(
    brokerId: string,
    businessId: string,
  ): Promise<Business> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    const business = await this.businessRepository.findOne({
      where: { id: businessId, brokerId },
      relations: ['owner', 'branches'],
    });

    if (!business) {
      throw new NotFoundException(
        'Business not found or not managed by this broker',
      );
    }

    return business;
  }

  async updateBusiness(
    brokerId: string,
    businessId: string,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    const business = await this.getBusinessById(brokerId, businessId);

    Object.assign(business, updateBusinessDto);
    return await this.businessRepository.save(business);
  }

  async toggleBusinessStatus(
    brokerId: string,
    businessId: string,
  ): Promise<Business> {
    const business = await this.getBusinessById(brokerId, businessId);
    business.isActive = !business.isActive;
    return await this.businessRepository.save(business);
  }

  // Client Management & Statistics
  async getBrokerStats(brokerId: string): Promise<any> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    const [totalBusinesses, activeBusinesses, totalOwners, activeBranches] =
      await Promise.all([
        this.businessRepository.count({ where: { brokerId } }),
        this.businessRepository.count({ where: { brokerId, isActive: true } }),
        this.businessRepository
          .createQueryBuilder('business')
          .leftJoin('business.owner', 'owner')
          .where('business.brokerId = :brokerId', { brokerId })
          .andWhere('owner.id IS NOT NULL')
          .getCount(),
        this.branchRepository
          .createQueryBuilder('branch')
          .leftJoin('branch.business', 'business')
          .where('business.brokerId = :brokerId', { brokerId })
          .andWhere('branch.isActive = :isActive', { isActive: true })
          .getCount(),
      ]);

    return {
      businesses: {
        total: totalBusinesses,
        active: activeBusinesses,
        inactive: totalBusinesses - activeBusinesses,
      },
      businessOwners: {
        total: totalOwners,
      },
      branches: {
        active: activeBranches,
      },
    };
  }

  // Funding Applications (placeholder for future implementation)
  async getFundingApplications(brokerId: string): Promise<any[]> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    // Placeholder - this would integrate with a funding system
    return [];
  }

  async createFundingApplication(
    brokerId: string,
    businessId: string,
    applicationData: any,
  ): Promise<any> {
    // Verify broker exists and business belongs to broker
    await this.getBusinessById(brokerId, businessId);

    // Placeholder - this would integrate with a funding system
    return {
      id: 'funding-app-' + Date.now(),
      businessId,
      brokerId,
      status: 'pending',
      ...applicationData,
      createdAt: new Date(),
    };
  }

  // Funding Rates Management (placeholder for future implementation)
  async getFundingRates(brokerId: string): Promise<any[]> {
    // Verify broker exists
    await this.getBrokerProfile(brokerId);

    // Placeholder - this would return current funding rates
    return [
      {
        id: 'rate-1',
        type: 'merchant_cash_advance',
        rate: 1.2,
        term: '6 months',
        minAmount: 5000,
        maxAmount: 100000,
      },
      {
        id: 'rate-2',
        type: 'business_loan',
        rate: 0.08,
        term: '12 months',
        minAmount: 10000,
        maxAmount: 500000,
      },
    ];
  }
}
