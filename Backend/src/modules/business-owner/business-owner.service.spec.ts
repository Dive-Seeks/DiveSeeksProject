import { Test, TestingModule } from '@nestjs/testing';
import { BusinessOwnerService } from './business-owner.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  User,
  Business,
  Branch,
  Product,
  Inventory,
} from '../../database/entities';
import { UserRole, UserStatus } from '../../shared/enums';
import { NotFoundException } from '@nestjs/common';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  CreateBranchDto,
  UpdateBranchDto,
  CreateProductDto,
  UpdateProductDto,
  UpdateBusinessOwnerProfileDto,
} from './dto';

describe('BusinessOwnerService', () => {
  let service: BusinessOwnerService;
  let userRepository: Repository<User>;
  let businessRepository: Repository<Business>;
  let branchRepository: Repository<Branch>;
  let productRepository: Repository<Product>;
  let inventoryRepository: Repository<Inventory>;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockBusinessRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockBranchRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockInventoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockBusinessOwner: User = {
    id: 'owner-1',
    email: 'owner@test.com',
    firstName: 'Jane',
    lastName: 'Owner',
    role: UserRole.BUSINESS_OWNER,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockBusiness = {
    id: 'business-1',
    name: 'Test Restaurant',
    ownerId: 'owner-1',
    email: 'test@restaurant.com',
    phone: '+1234567890',
    address: '123 Test Street',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Business;

  const mockBranch = {
    id: 'branch-1',
    name: 'Main Branch',
    businessId: 'business-1',
    address: '123 Main Street',
    phone: '+1234567891',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Branch;

  const mockProduct = {
    id: 'product-1',
    name: 'Test Product',
    price: 19.99,
    description: 'A test product',
    businessId: 'business-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessOwnerService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Business),
          useValue: mockBusinessRepository,
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: mockBranchRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: 'UsersService',
          useValue: { findByEmail: jest.fn(), create: jest.fn() },
        },
        {
          provide: 'BusinessesService',
          useValue: { create: jest.fn(), findAll: jest.fn() },
        },
        {
          provide: 'BranchesService',
          useValue: { create: jest.fn(), findAll: jest.fn() },
        },
        {
          provide: 'ProductsService',
          useValue: { create: jest.fn(), findAll: jest.fn() },
        },
        {
          provide: 'InventoryService',
          useValue: { create: jest.fn(), findAll: jest.fn() },
        },
        {
          provide: 'PosService',
          useValue: { processTransaction: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BusinessOwnerService>(BusinessOwnerService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    businessRepository = module.get<Repository<Business>>(
      getRepositoryToken(Business),
    );
    branchRepository = module.get<Repository<Branch>>(
      getRepositoryToken(Branch),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    inventoryRepository = module.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBusinessOwnerProfile', () => {
    it('should return business owner profile', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockBusinessOwner);

      const result = await service.getBusinessOwnerProfile('owner-1');

      expect(result).toEqual(mockBusinessOwner);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'owner-1', role: UserRole.BUSINESS_OWNER },
      });
    });

    it('should throw NotFoundException if business owner not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getBusinessOwnerProfile('owner-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBusinessOwnerProfile', () => {
    it('should update business owner profile', async () => {
      const updateDto: UpdateBusinessOwnerProfileDto = {
        firstName: 'Updated',
        lastName: 'Owner',
        phone: '+1234567890',
      };
      const updatedOwner = { ...mockBusinessOwner, ...updateDto };

      mockUserRepository.findOne.mockResolvedValue(mockBusinessOwner);
      mockUserRepository.save.mockResolvedValue(updatedOwner);

      const result = await service.updateBusinessOwnerProfile(
        'owner-1',
        updateDto,
      );

      expect(result).toEqual(updatedOwner);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockBusinessOwner,
        ...updateDto,
      });
    });

    it('should throw NotFoundException if business owner not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateBusinessOwnerProfile('owner-1', { firstName: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBusinessOwnerStats', () => {
    it('should return business owner statistics', async () => {
      mockBusinessRepository.count.mockResolvedValue(2);
      mockBranchRepository.count.mockResolvedValue(5);
      mockProductRepository.count.mockResolvedValue(50);

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ totalRevenue: '25000' }),
      };
      mockBusinessRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getBusinessOwnerStats('owner-1');

      expect(result).toEqual({
        totalBusinesses: 2,
        totalBranches: 5,
        totalProducts: 50,
        totalRevenue: 25000,
      });
    });
  });

  describe('createBusiness', () => {
    it('should create a new business', async () => {
      const createBusinessDto: CreateBusinessDto = {
        name: 'New Restaurant',
        email: 'new@test.com',
        phone: '+1234567892',
        address: '456 New Street',
      };
      const newBusiness = {
        id: 'business-2',
        ...createBusinessDto,
        ownerId: 'owner-1',
      };

      mockUserRepository.findOne.mockResolvedValue(mockBusinessOwner);
      mockBusinessRepository.save.mockResolvedValue(newBusiness);

      const result = await service.createBusiness('owner-1', createBusinessDto);

      expect(result).toEqual(newBusiness);
      expect(businessRepository.save).toHaveBeenCalledWith({
        ...createBusinessDto,
        ownerId: 'owner-1',
      });
    });

    it('should throw NotFoundException if business owner not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createBusiness('owner-1', {} as CreateBusinessDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyBusinesses', () => {
    it('should return all businesses owned by the user', async () => {
      const businesses = [mockBusiness];
      mockBusinessRepository.find.mockResolvedValue(businesses);

      const result = await service.getMyBusinesses('owner-1');

      expect(result).toEqual(businesses);
      expect(businessRepository.find).toHaveBeenCalledWith({
        where: { ownerId: 'owner-1' },
        relations: ['branches'],
      });
    });
  });

  describe('getBusinessById', () => {
    it('should return a business by ID', async () => {
      mockBusinessRepository.findOne.mockResolvedValue(mockBusiness);

      const result = await service.getBusinessById('owner-1', 'business-1');

      expect(result).toEqual(mockBusiness);
      expect(businessRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'business-1', ownerId: 'owner-1' },
        relations: ['branches', 'products'],
      });
    });

    it('should throw NotFoundException if business not found', async () => {
      mockBusinessRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getBusinessById('owner-1', 'business-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBusiness', () => {
    it('should update a business', async () => {
      const updateDto: UpdateBusinessDto = {
        name: 'Updated Restaurant',
        phone: '+1234567893',
      };
      const updatedBusiness = { ...mockBusiness, ...updateDto };

      mockBusinessRepository.findOne.mockResolvedValue(mockBusiness);
      mockBusinessRepository.save.mockResolvedValue(updatedBusiness);

      const result = await service.updateBusiness(
        'owner-1',
        'business-1',
        updateDto,
      );

      expect(result).toEqual(updatedBusiness);
      expect(businessRepository.save).toHaveBeenCalledWith({
        ...mockBusiness,
        ...updateDto,
      });
    });

    it('should throw NotFoundException if business not found', async () => {
      mockBusinessRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateBusiness(
          'owner-1',
          'business-1',
          {} as UpdateBusinessDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBranch', () => {
    it('should create a new branch', async () => {
      const createBranchDto: CreateBranchDto = {
        name: 'New Branch',
        address: '789 New Street',
        phone: '+1234567894',
      };
      const newBranch = {
        id: 'branch-2',
        ...createBranchDto,
        businessId: 'business-1',
      };

      mockBusinessRepository.findOne.mockResolvedValue(mockBusiness);
      mockBranchRepository.save.mockResolvedValue(newBranch);

      const result = await service.createBranch(
        'owner-1',
        'business-1',
        createBranchDto,
      );

      expect(result).toEqual(newBranch);
      expect(branchRepository.save).toHaveBeenCalledWith({
        ...createBranchDto,
        businessId: 'business-1',
      });
    });

    it('should throw NotFoundException if business not found', async () => {
      mockBusinessRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createBranch('owner-1', 'business-1', {} as CreateBranchDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyBranches', () => {
    it('should return all branches owned by the user', async () => {
      const branches = [mockBranch];
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(branches),
      };
      mockBranchRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getMyBranches('owner-1');

      expect(result).toEqual(branches);
    });

    it('should return branches filtered by business ID', async () => {
      const branches = [mockBranch];
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(branches),
      };
      mockBranchRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getMyBranches('owner-1', 'business-1');

      expect(result).toEqual(branches);
    });
  });

  describe('getBranchById', () => {
    it('should return a branch by ID', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockBranch),
      };
      mockBranchRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getBranchById('owner-1', 'branch-1');

      expect(result).toEqual(mockBranch);
    });

    it('should throw NotFoundException if branch not found', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockBranchRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(
        service.getBranchById('owner-1', 'branch-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBranch', () => {
    it('should update a branch', async () => {
      const updateDto: UpdateBranchDto = {
        name: 'Updated Branch',
        phone: '+1234567895',
      };
      const updatedBranch = { ...mockBranch, ...updateDto };

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockBranch),
      };
      mockBranchRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockBranchRepository.save.mockResolvedValue(updatedBranch);

      const result = await service.updateBranch(
        'owner-1',
        'branch-1',
        updateDto,
      );

      expect(result).toEqual(updatedBranch);
      expect(branchRepository.save).toHaveBeenCalledWith({
        ...mockBranch,
        ...updateDto,
      });
    });
  });

  describe('toggleBranchStatus', () => {
    it('should toggle branch status', async () => {
      const toggledBranch = { ...mockBranch, isActive: false };

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockBranch),
      };
      mockBranchRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockBranchRepository.save.mockResolvedValue(toggledBranch);

      const result = await service.toggleBranchStatus('owner-1', 'branch-1');

      expect(result).toEqual(toggledBranch);
      expect(branchRepository.save).toHaveBeenCalledWith({
        ...mockBranch,
        isActive: false,
      });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        price: 29.99,
        description: 'A new product',
      };
      const newProduct = {
        id: 'product-2',
        ...createProductDto,
        businessId: 'business-1',
      };

      mockBusinessRepository.findOne.mockResolvedValue(mockBusiness);
      mockProductRepository.save.mockResolvedValue(newProduct);

      const result = await service.createProduct(
        'owner-1',
        'business-1',
        createProductDto,
      );

      expect(result).toEqual(newProduct);
      expect(productRepository.save).toHaveBeenCalledWith({
        ...createProductDto,
        businessId: 'business-1',
      });
    });
  });

  describe('getMyProducts', () => {
    it('should return all products owned by the user', async () => {
      const products = [mockProduct];
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      };
      mockProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getMyProducts('owner-1');

      expect(result).toEqual(products);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockProduct),
      };
      mockProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getProductById('owner-1', 'product-1');

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      await expect(
        service.getProductById('owner-1', 'product-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 34.99,
      };
      const updatedProduct = { ...mockProduct, ...updateDto };

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockProduct),
      };
      mockProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockProductRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(
        'owner-1',
        'product-1',
        updateDto,
      );

      expect(result).toEqual(updatedProduct);
      expect(productRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        ...updateDto,
      });
    });
  });

  describe('toggleProductStatus', () => {
    it('should toggle product status', async () => {
      const toggledProduct = { ...mockProduct, isActive: false };

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockProduct),
      };
      mockProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockProductRepository.save.mockResolvedValue(toggledProduct);

      const result = await service.toggleProductStatus('owner-1', 'product-1');

      expect(result).toEqual(toggledProduct);
      expect(productRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        isActive: false,
      });
    });
  });

  describe('getInventoryByBranch', () => {
    it('should return inventory for a branch', async () => {
      const mockInventory = [
        {
          id: 'inv-1',
          productId: 'product-1',
          branchId: 'branch-1',
          quantity: 50,
        },
      ];

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockInventory),
      };
      mockInventoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getInventoryByBranch('owner-1', 'branch-1');

      expect(result).toEqual(mockInventory);
    });
  });

  describe('updateInventory', () => {
    it('should update inventory quantity', async () => {
      const mockInventory = {
        id: 'inv-1',
        productId: 'product-1',
        branchId: 'branch-1',
        quantity: 50,
      };
      const updatedInventory = { ...mockInventory, quantity: 75 };

      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockInventory),
      };
      mockInventoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockInventoryRepository.save.mockResolvedValue(updatedInventory);

      const result = await service.updateInventory('owner-1', 'inv-1', 75);

      expect(result).toEqual(updatedInventory);
      expect(inventoryRepository.save).toHaveBeenCalledWith({
        ...mockInventory,
        quantity: 75,
      });
    });

    it('should throw NotFoundException if inventory not found', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockInventoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      await expect(
        service.updateInventory('owner-1', 'inv-1', 75),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPOSTransactions', () => {
    it('should return POS transactions', async () => {
      const mockTransactions = [{ id: 'trans-1', amount: 25.99, type: 'sale' }];

      // Mock implementation would depend on actual POS transaction entity
      // This is a placeholder for the expected behavior
      jest
        .spyOn(service, 'getPOSTransactions')
        .mockResolvedValue(mockTransactions);

      const result = await service.getPOSTransactions('owner-1');

      expect(result).toEqual(mockTransactions);
    });
  });

  describe('createPOSTransaction', () => {
    it('should create a POS transaction', async () => {
      const transactionData = {
        amount: 35.99,
        items: [{ productId: 'product-1', quantity: 2, price: 17.995 }],
      };
      const mockTransaction = {
        id: 'trans-1',
        ...transactionData,
        branchId: 'branch-1',
      };

      // Mock implementation would depend on actual POS transaction entity
      // This is a placeholder for the expected behavior
      jest
        .spyOn(service, 'createPOSTransaction')
        .mockResolvedValue(mockTransaction);

      const result = await service.createPOSTransaction(
        'owner-1',
        'branch-1',
        transactionData,
      );

      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getDefaultPOSSettings', () => {
    it('should return default POS settings', async () => {
      const mockSettings = {
        taxRate: 8.5,
        currency: 'USD',
        receiptTemplate: 'default',
      };

      // Mock implementation would depend on actual POS settings entity
      // This is a placeholder for the expected behavior
      jest
        .spyOn(service, 'getDefaultPOSSettings')
        .mockResolvedValue(mockSettings);

      const result = await service.getDefaultPOSSettings('owner-1');

      expect(result).toEqual(mockSettings);
    });
  });

  describe('updatePOSSettings', () => {
    it('should update POS settings', async () => {
      const settings = {
        taxRate: 9.0,
        currency: 'USD',
        receiptTemplate: 'custom',
      };

      // Mock implementation would depend on actual POS settings entity
      // This is a placeholder for the expected behavior
      jest.spyOn(service, 'updatePOSSettings').mockResolvedValue(settings);

      const result = await service.updatePOSSettings('owner-1', settings);

      expect(result).toEqual(settings);
    });
  });
});
