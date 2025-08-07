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
  CreateBrokerDto,
  UpdateBrokerDto,
  CreateBusinessOwnerDto,
  UpdateBusinessOwnerDto,
} from './dto';
import { UsersService } from '../users/users.service';
import { BusinessesService } from '../businesses/businesses.service';
import { BranchesService } from '../branches/branches.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private usersService: UsersService,
    private businessesService: BusinessesService,
    private branchesService: BranchesService,
  ) {}

  // Broker Management
  async createBroker(createBrokerDto: CreateBrokerDto): Promise<User> {
    const { email, password, firstName, lastName, phone } = createBrokerDto;

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

    // Create broker
    const broker = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      role: UserRole.BROKER,
      status: UserStatus.ACTIVE,
    });

    return await this.userRepository.save(broker);
  }

  async getAllBrokers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: UserRole.BROKER },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'status',
        'createdAt',
        'lastLoginAt',
      ],
    });
  }

  async getBrokerById(id: string): Promise<User> {
    const broker = await this.userRepository.findOne({
      where: { id, role: UserRole.BROKER },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
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

  async updateBroker(
    id: string,
    updateBrokerDto: UpdateBrokerDto,
  ): Promise<User> {
    const broker = await this.getBrokerById(id);

    if (updateBrokerDto.password) {
      const saltRounds = 10;
      updateBrokerDto.password = await bcrypt.hash(
        updateBrokerDto.password,
        saltRounds,
      );
    }

    Object.assign(broker, updateBrokerDto);
    return await this.userRepository.save(broker);
  }

  async deleteBroker(id: string): Promise<void> {
    const broker = await this.getBrokerById(id);
    await this.userRepository.remove(broker);
  }

  async toggleBrokerStatus(id: string): Promise<User> {
    const broker = await this.getBrokerById(id);
    broker.status =
      broker.status === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;
    return await this.userRepository.save(broker);
  }

  // Business Owner Management
  async createBusinessOwner(
    createBusinessOwnerDto: CreateBusinessOwnerDto,
  ): Promise<User> {
    const { email, password, firstName, lastName, phone, brokerId } =
      createBusinessOwnerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Verify broker exists if provided
    if (brokerId) {
      await this.getBrokerById(brokerId);
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

  async getAllBusinessOwners(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: UserRole.BUSINESS_OWNER },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'status',
        'createdAt',
        'lastLoginAt',
      ],
    });
  }

  async getBusinessOwnerById(id: string): Promise<User> {
    const businessOwner = await this.userRepository.findOne({
      where: { id, role: UserRole.BUSINESS_OWNER },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'status',
        'createdAt',
        'lastLoginAt',
      ],
    });

    if (!businessOwner) {
      throw new NotFoundException('Business owner not found');
    }

    return businessOwner;
  }

  async updateBusinessOwner(
    id: string,
    updateBusinessOwnerDto: UpdateBusinessOwnerDto,
  ): Promise<User> {
    const businessOwner = await this.getBusinessOwnerById(id);

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

  async deleteBusinessOwner(id: string): Promise<void> {
    const businessOwner = await this.getBusinessOwnerById(id);
    await this.userRepository.remove(businessOwner);
  }

  async toggleBusinessOwnerStatus(id: string): Promise<User> {
    const businessOwner = await this.getBusinessOwnerById(id);
    businessOwner.status =
      businessOwner.status === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;
    return await this.userRepository.save(businessOwner);
  }

  // System Statistics
  async getSystemStats(): Promise<any> {
    const [
      totalBrokers,
      activeBrokers,
      totalBusinessOwners,
      activeBusinessOwners,
      totalBusinesses,
      activeBranches,
    ] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.BROKER } }),
      this.userRepository.count({
        where: { role: UserRole.BROKER, status: UserStatus.ACTIVE },
      }),
      this.userRepository.count({ where: { role: UserRole.BUSINESS_OWNER } }),
      this.userRepository.count({
        where: { role: UserRole.BUSINESS_OWNER, status: UserStatus.ACTIVE },
      }),
      this.businessRepository.count(),
      this.branchRepository.count({ where: { isActive: true } }),
    ]);

    return {
      brokers: {
        total: totalBrokers,
        active: activeBrokers,
        inactive: totalBrokers - activeBrokers,
      },
      businessOwners: {
        total: totalBusinessOwners,
        active: activeBusinessOwners,
        inactive: totalBusinessOwners - activeBusinessOwners,
      },
      businesses: {
        total: totalBusinesses,
      },
      branches: {
        active: activeBranches,
      },
    };
  }

  // Business Management
  async getAllBusinesses(): Promise<Business[]> {
    return await this.businessRepository.find({
      relations: ['owner', 'broker'],
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
        broker: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
  }

  async getBusinessById(id: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['owner', 'broker', 'branches'],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async toggleBusinessStatus(id: string): Promise<Business> {
    const business = await this.getBusinessById(id);
    business.isActive = !business.isActive;
    return await this.businessRepository.save(business);
  }

  // Branch Management
  async getAllBranches(): Promise<Branch[]> {
    return await this.branchRepository.find({
      relations: ['business', 'business.owner'],
      select: {
        id: true,
        name: true,
        addressLine1: true,
        city: true,
        phone: true,
        isActive: true,
        createdAt: true,
        business: {
          id: true,
          name: true,
          owner: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getBranchById(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['business', 'business.owner'],
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async toggleBranchStatus(id: string): Promise<Branch> {
    const branch = await this.getBranchById(id);
    branch.isActive = !branch.isActive;
    return await this.branchRepository.save(branch);
  }
}
