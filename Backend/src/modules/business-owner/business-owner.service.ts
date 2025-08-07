import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  Business,
  Branch,
  Product,
  Inventory,
} from '../../database/entities';
import { UserRole } from '../../shared/enums';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  CreateBranchDto,
  UpdateBranchDto,
  UpdateBusinessOwnerProfileDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto';
import { UsersService } from '../users/users.service';
import { BusinessesService } from '../businesses/businesses.service';
import { BranchesService } from '../branches/branches.service';
import { ProductsService } from '../products/products.service';
import { InventoryService } from '../inventory/inventory.service';
import { PosService } from '../pos/pos.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BusinessOwnerService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private usersService: UsersService,
    private businessesService: BusinessesService,
    private branchesService: BranchesService,
    private productsService: ProductsService,
    private inventoryService: InventoryService,
    private posService: PosService,
  ) {}

  // Business Owner Profile Management
  async getBusinessOwnerProfile(ownerId: string): Promise<User> {
    const owner = await this.userRepository.findOne({
      where: { id: ownerId, role: UserRole.BUSINESS_OWNER },
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

    if (!owner) {
      throw new NotFoundException('Business owner not found');
    }

    return owner;
  }

  async updateBusinessOwnerProfile(
    ownerId: string,
    updateProfileDto: UpdateBusinessOwnerProfileDto,
  ): Promise<User> {
    const owner = await this.getBusinessOwnerProfile(ownerId);

    if (updateProfileDto.password) {
      const saltRounds = 10;
      updateProfileDto.password = await bcrypt.hash(
        updateProfileDto.password,
        saltRounds,
      );
    }

    Object.assign(owner, updateProfileDto);
    return await this.userRepository.save(owner);
  }

  // Business Registration and Management
  async createBusiness(
    ownerId: string,
    createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    // Check if business name already exists for this owner
    const existingBusiness = await this.businessRepository.findOne({
      where: { name: createBusinessDto.name, ownerId },
    });

    if (existingBusiness) {
      throw new BadRequestException('Business with this name already exists');
    }

    // Create business
    const business = this.businessRepository.create({
      ...createBusinessDto,
      ownerId,
      isActive: true,
    });

    return await this.businessRepository.save(business);
  }

  async getMyBusinesses(ownerId: string): Promise<Business[]> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    return await this.businessRepository.find({
      where: { ownerId },
      relations: ['branches'],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        description: true,
        website: true,
        businessType: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async getBusinessById(
    ownerId: string,
    businessId: string,
  ): Promise<Business> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    const business = await this.businessRepository.findOne({
      where: { id: businessId, ownerId },
      relations: ['branches', 'broker'],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async updateBusiness(
    ownerId: string,
    businessId: string,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    const business = await this.getBusinessById(ownerId, businessId);

    Object.assign(business, updateBusinessDto);
    return await this.businessRepository.save(business);
  }

  // Branch Management
  async createBranch(
    ownerId: string,
    businessId: string,
    createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    // Verify business belongs to owner
    await this.getBusinessById(ownerId, businessId);

    // Create branch
    const branch = this.branchRepository.create({
      ...createBranchDto,
      businessId,
      isActive: true,
    });

    return await this.branchRepository.save(branch);
  }

  async getMyBranches(ownerId: string, businessId?: string): Promise<Branch[]> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    const queryBuilder = this.branchRepository
      .createQueryBuilder('branch')
      .leftJoinAndSelect('branch.business', 'business')
      .where('business.ownerId = :ownerId', { ownerId });

    if (businessId) {
      queryBuilder.andWhere('branch.businessId = :businessId', { businessId });
    }

    return await queryBuilder.getMany();
  }

  async getBranchById(ownerId: string, branchId: string): Promise<Branch> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    const branch = await this.branchRepository
      .createQueryBuilder('branch')
      .leftJoinAndSelect('branch.business', 'business')
      .where('branch.id = :branchId', { branchId })
      .andWhere('business.ownerId = :ownerId', { ownerId })
      .getOne();

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async updateBranch(
    ownerId: string,
    branchId: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    const branch = await this.getBranchById(ownerId, branchId);

    Object.assign(branch, updateBranchDto);
    return await this.branchRepository.save(branch);
  }

  async toggleBranchStatus(ownerId: string, branchId: string): Promise<Branch> {
    const branch = await this.getBranchById(ownerId, branchId);
    branch.isActive = !branch.isActive;
    return await this.branchRepository.save(branch);
  }

  // Product Management
  async createProduct(
    ownerId: string,
    businessId: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    // Verify business belongs to owner
    await this.getBusinessById(ownerId, businessId);

    // Get the first branch of the business to assign the product
    const branches = await this.branchRepository.find({
      where: { businessId },
      take: 1,
    });

    if (branches.length === 0) {
      throw new NotFoundException('No branches found for this business');
    }

    // Create product
    const product = this.productRepository.create({
      ...createProductDto,
      branchId: branches[0].id,
      isActive: true,
    });

    return await this.productRepository.save(product);
  }

  async getMyProducts(
    ownerId: string,
    businessId?: string,
  ): Promise<Product[]> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.branch', 'branch')
      .leftJoinAndSelect('branch.business', 'business')
      .where('business.ownerId = :ownerId', { ownerId });

    if (businessId) {
      queryBuilder.andWhere('branch.businessId = :businessId', { businessId });
    }

    return await queryBuilder.getMany();
  }

  async getProductById(ownerId: string, productId: string): Promise<Product> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.branch', 'branch')
      .leftJoinAndSelect('branch.business', 'business')
      .where('product.id = :productId', { productId })
      .andWhere('business.ownerId = :ownerId', { ownerId })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(
    ownerId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(ownerId, productId);

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async toggleProductStatus(
    ownerId: string,
    productId: string,
  ): Promise<Product> {
    const product = await this.getProductById(ownerId, productId);
    product.isActive = !product.isActive;
    return await this.productRepository.save(product);
  }

  // Inventory Management
  async getInventoryByBranch(
    ownerId: string,
    branchId: string,
  ): Promise<Inventory[]> {
    // Verify branch belongs to owner
    await this.getBranchById(ownerId, branchId);

    return await this.inventoryRepository.find({
      where: { branchId },
      relations: ['product'],
    });
  }

  async updateInventory(
    ownerId: string,
    inventoryId: string,
    quantity: number,
  ): Promise<Inventory> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    const inventory = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.branch', 'branch')
      .leftJoinAndSelect('branch.business', 'business')
      .where('inventory.id = :inventoryId', { inventoryId })
      .andWhere('business.ownerId = :ownerId', { ownerId })
      .getOne();

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    inventory.quantity = quantity;
    return await this.inventoryRepository.save(inventory);
  }

  // POS Operations
  async getPOSTransactions(
    ownerId: string,
    _branchId?: string,
  ): Promise<any[]> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    // This would integrate with the POS service
    // For now, return placeholder data
    return [];
  }

  async createPOSTransaction(
    ownerId: string,
    branchId: string,
    transactionData: any,
  ): Promise<any> {
    // Verify branch belongs to owner
    await this.getBranchById(ownerId, branchId);

    // This would integrate with the POS service
    // For now, return placeholder data
    return {
      id: 'pos-' + Date.now(),
      branchId,
      ...transactionData,
      createdAt: new Date(),
    };
  }

  // Business Owner Statistics
  async getBusinessOwnerStats(ownerId: string): Promise<any> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    const [
      totalBusinesses,
      activeBusinesses,
      totalBranches,
      activeBranches,
      totalProducts,
      activeProducts,
    ] = await Promise.all([
      this.businessRepository.count({ where: { ownerId } }),
      this.businessRepository.count({ where: { ownerId, isActive: true } }),
      this.branchRepository
        .createQueryBuilder('branch')
        .leftJoin('branch.business', 'business')
        .where('business.ownerId = :ownerId', { ownerId })
        .getCount(),
      this.branchRepository
        .createQueryBuilder('branch')
        .leftJoin('branch.business', 'business')
        .where('business.ownerId = :ownerId', { ownerId })
        .andWhere('branch.isActive = :isActive', { isActive: true })
        .getCount(),
      this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.branch', 'branch')
        .leftJoin('branch.business', 'business')
        .where('business.ownerId = :ownerId', { ownerId })
        .getCount(),
      this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.branch', 'branch')
        .leftJoin('branch.business', 'business')
        .where('business.ownerId = :ownerId', { ownerId })
        .andWhere('product.isActive = :isActive', { isActive: true })
        .getCount(),
    ]);

    return {
      businesses: {
        total: totalBusinesses,
        active: activeBusinesses,
        inactive: totalBusinesses - activeBusinesses,
      },
      branches: {
        total: totalBranches,
        active: activeBranches,
        inactive: totalBranches - activeBranches,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: totalProducts - activeProducts,
      },
    };
  }

  // Default POS Settings
  async getDefaultPOSSettings(ownerId: string): Promise<any> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    // Return default POS settings
    return {
      currency: 'USD',
      taxRate: 0.08,
      receiptTemplate: 'default',
      paymentMethods: ['cash', 'card', 'digital'],
      autoInventoryUpdate: true,
      printReceipts: true,
      emailReceipts: false,
    };
  }

  async updatePOSSettings(ownerId: string, settings: any): Promise<any> {
    // Verify business owner exists
    await this.getBusinessOwnerProfile(ownerId);

    // This would save POS settings to database
    // For now, return the updated settings
    return {
      ...settings,
      updatedAt: new Date(),
    };
  }
}
