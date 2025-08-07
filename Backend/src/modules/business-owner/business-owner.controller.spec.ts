import { Test, TestingModule } from '@nestjs/testing';
import { BusinessOwnerController } from './business-owner.controller';
import { BusinessOwnerService } from './business-owner.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  CreateBranchDto,
  UpdateBranchDto,
  CreateProductDto,
  UpdateProductDto,
  UpdateBusinessOwnerProfileDto,
} from './dto';
import { UserRole } from '../../shared/enums';

describe('BusinessOwnerController', () => {
  let controller: BusinessOwnerController;
  let service: BusinessOwnerService;

  const mockBusinessOwnerService = {
    getBusinessOwnerProfile: jest.fn(),
    updateBusinessOwnerProfile: jest.fn(),
    getBusinessOwnerStats: jest.fn(),
    createBusiness: jest.fn(),
    getMyBusinesses: jest.fn(),
    getBusinessById: jest.fn(),
    updateBusiness: jest.fn(),
    createBranch: jest.fn(),
    getMyBranches: jest.fn(),
    getBranchById: jest.fn(),
    updateBranch: jest.fn(),
    toggleBranchStatus: jest.fn(),
    createProduct: jest.fn(),
    getMyProducts: jest.fn(),
    getProductById: jest.fn(),
    updateProduct: jest.fn(),
    toggleProductStatus: jest.fn(),
    getInventoryByBranch: jest.fn(),
    updateInventory: jest.fn(),
    getPOSTransactions: jest.fn(),
    createPOSTransaction: jest.fn(),
    getDefaultPOSSettings: jest.fn(),
    updatePOSSettings: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRequest = {
    user: {
      id: 'owner-1',
      email: 'owner@test.com',
      role: UserRole.BUSINESS_OWNER,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessOwnerController],
      providers: [
        {
          provide: BusinessOwnerService,
          useValue: mockBusinessOwnerService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<BusinessOwnerController>(BusinessOwnerController);
    service = module.get<BusinessOwnerService>(BusinessOwnerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return business owner profile', async () => {
      const mockProfile = {
        id: 'owner-1',
        email: 'owner@test.com',
        firstName: 'Jane',
        lastName: 'Owner',
        role: UserRole.BUSINESS_OWNER,
      };
      mockBusinessOwnerService.getBusinessOwnerProfile.mockResolvedValue(
        mockProfile,
      );

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockProfile);
      expect(service.getBusinessOwnerProfile).toHaveBeenCalledWith('owner-1');
    });
  });

  describe('updateProfile', () => {
    it('should update business owner profile', async () => {
      const updateProfileDto: UpdateBusinessOwnerProfileDto = {
        firstName: 'Updated',
        lastName: 'Owner',
        phone: '+1234567890',
      };
      const mockUpdatedProfile = { id: 'owner-1', ...updateProfileDto };
      mockBusinessOwnerService.updateBusinessOwnerProfile.mockResolvedValue(
        mockUpdatedProfile,
      );

      const result = await controller.updateProfile(
        mockRequest,
        updateProfileDto,
      );

      expect(result).toEqual(mockUpdatedProfile);
      expect(service.updateBusinessOwnerProfile).toHaveBeenCalledWith(
        'owner-1',
        updateProfileDto,
      );
    });
  });

  describe('getStats', () => {
    it('should return business owner statistics', async () => {
      const mockStats = {
        totalBusinesses: 2,
        totalBranches: 5,
        totalProducts: 50,
        totalRevenue: 25000,
      };
      mockBusinessOwnerService.getBusinessOwnerStats.mockResolvedValue(
        mockStats,
      );

      const result = await controller.getStats(mockRequest);

      expect(result).toEqual(mockStats);
      expect(service.getBusinessOwnerStats).toHaveBeenCalledWith('owner-1');
    });
  });

  describe('createBusiness', () => {
    it('should create a new business', async () => {
      const createBusinessDto: CreateBusinessDto = {
        name: 'Test Restaurant',
        email: 'restaurant@test.com',
        phone: '+1234567892',
        address: '123 Test Street',
      };
      const mockBusiness = { id: 'business-1', ...createBusinessDto };
      mockBusinessOwnerService.createBusiness.mockResolvedValue(mockBusiness);

      const result = await controller.createBusiness(
        mockRequest,
        createBusinessDto,
      );

      expect(result).toEqual(mockBusiness);
      expect(service.createBusiness).toHaveBeenCalledWith(
        'owner-1',
        createBusinessDto,
      );
    });
  });

  describe('getMyBusinesses', () => {
    it('should return all businesses owned by the user', async () => {
      const mockBusinesses = [
        { id: 'business-1', name: 'Restaurant 1' },
        { id: 'business-2', name: 'Restaurant 2' },
      ];
      mockBusinessOwnerService.getMyBusinesses.mockResolvedValue(
        mockBusinesses,
      );

      const result = await controller.getMyBusinesses(mockRequest);

      expect(result).toEqual(mockBusinesses);
      expect(service.getMyBusinesses).toHaveBeenCalledWith('owner-1');
    });
  });

  describe('getBusinessById', () => {
    it('should return a business by ID', async () => {
      const businessId = 'business-1';
      const mockBusiness = { id: businessId, name: 'Test Restaurant' };
      mockBusinessOwnerService.getBusinessById.mockResolvedValue(mockBusiness);

      const result = await controller.getBusinessById(mockRequest, businessId);

      expect(result).toEqual(mockBusiness);
      expect(service.getBusinessById).toHaveBeenCalledWith(
        'owner-1',
        businessId,
      );
    });
  });

  describe('updateBusiness', () => {
    it('should update a business', async () => {
      const businessId = 'business-1';
      const updateBusinessDto: UpdateBusinessDto = {
        name: 'Updated Restaurant',
        phone: '+1234567893',
      };
      const mockUpdatedBusiness = { id: businessId, ...updateBusinessDto };
      mockBusinessOwnerService.updateBusiness.mockResolvedValue(
        mockUpdatedBusiness,
      );

      const result = await controller.updateBusiness(
        mockRequest,
        businessId,
        updateBusinessDto,
      );

      expect(result).toEqual(mockUpdatedBusiness);
      expect(service.updateBusiness).toHaveBeenCalledWith(
        'owner-1',
        businessId,
        updateBusinessDto,
      );
    });
  });

  describe('createBranch', () => {
    it('should create a new branch', async () => {
      const businessId = 'business-1';
      const createBranchDto: CreateBranchDto = {
        name: 'Main Branch',
        address: '123 Main Street',
        phone: '+1234567894',
      };
      const mockBranch = { id: 'branch-1', ...createBranchDto, businessId };
      mockBusinessOwnerService.createBranch.mockResolvedValue(mockBranch);

      const result = await controller.createBranch(
        mockRequest,
        businessId,
        createBranchDto,
      );

      expect(result).toEqual(mockBranch);
      expect(service.createBranch).toHaveBeenCalledWith(
        'owner-1',
        businessId,
        createBranchDto,
      );
    });
  });

  describe('getMyBranches', () => {
    it('should return all branches owned by the user', async () => {
      const mockBranches = [
        { id: 'branch-1', name: 'Main Branch' },
        { id: 'branch-2', name: 'Second Branch' },
      ];
      mockBusinessOwnerService.getMyBranches.mockResolvedValue(mockBranches);

      const result = await controller.getMyBranches(mockRequest);

      expect(result).toEqual(mockBranches);
      expect(service.getMyBranches).toHaveBeenCalledWith('owner-1', undefined);
    });

    it('should return branches filtered by business ID', async () => {
      const businessId = 'business-1';
      const mockBranches = [
        { id: 'branch-1', name: 'Main Branch', businessId },
      ];
      mockBusinessOwnerService.getMyBranches.mockResolvedValue(mockBranches);

      const result = await controller.getMyBranches(mockRequest, businessId);

      expect(result).toEqual(mockBranches);
      expect(service.getMyBranches).toHaveBeenCalledWith('owner-1', businessId);
    });
  });

  describe('getBranchById', () => {
    it('should return a branch by ID', async () => {
      const branchId = 'branch-1';
      const mockBranch = { id: branchId, name: 'Main Branch' };
      mockBusinessOwnerService.getBranchById.mockResolvedValue(mockBranch);

      const result = await controller.getBranchById(mockRequest, branchId);

      expect(result).toEqual(mockBranch);
      expect(service.getBranchById).toHaveBeenCalledWith('owner-1', branchId);
    });
  });

  describe('updateBranch', () => {
    it('should update a branch', async () => {
      const branchId = 'branch-1';
      const updateBranchDto: UpdateBranchDto = {
        name: 'Updated Branch',
        phone: '+1234567895',
      };
      const mockUpdatedBranch = { id: branchId, ...updateBranchDto };
      mockBusinessOwnerService.updateBranch.mockResolvedValue(
        mockUpdatedBranch,
      );

      const result = await controller.updateBranch(
        mockRequest,
        branchId,
        updateBranchDto,
      );

      expect(result).toEqual(mockUpdatedBranch);
      expect(service.updateBranch).toHaveBeenCalledWith(
        'owner-1',
        branchId,
        updateBranchDto,
      );
    });
  });

  describe('toggleBranchStatus', () => {
    it('should toggle branch status', async () => {
      const branchId = 'branch-1';
      const mockBranch = { id: branchId, isActive: false };
      mockBusinessOwnerService.toggleBranchStatus.mockResolvedValue(mockBranch);

      const result = await controller.toggleBranchStatus(mockRequest, branchId);

      expect(result).toEqual(mockBranch);
      expect(service.toggleBranchStatus).toHaveBeenCalledWith(
        'owner-1',
        branchId,
      );
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const businessId = 'business-1';
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 19.99,
        description: 'A test product',
      };
      const mockProduct = { id: 'product-1', ...createProductDto, businessId };
      mockBusinessOwnerService.createProduct.mockResolvedValue(mockProduct);

      const result = await controller.createProduct(
        mockRequest,
        businessId,
        createProductDto,
      );

      expect(result).toEqual(mockProduct);
      expect(service.createProduct).toHaveBeenCalledWith(
        'owner-1',
        businessId,
        createProductDto,
      );
    });
  });

  describe('getMyProducts', () => {
    it('should return all products owned by the user', async () => {
      const mockProducts = [
        { id: 'product-1', name: 'Product 1', price: 19.99 },
        { id: 'product-2', name: 'Product 2', price: 29.99 },
      ];
      mockBusinessOwnerService.getMyProducts.mockResolvedValue(mockProducts);

      const result = await controller.getMyProducts(mockRequest);

      expect(result).toEqual(mockProducts);
      expect(service.getMyProducts).toHaveBeenCalledWith('owner-1', undefined);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const productId = 'product-1';
      const mockProduct = { id: productId, name: 'Test Product', price: 19.99 };
      mockBusinessOwnerService.getProductById.mockResolvedValue(mockProduct);

      const result = await controller.getProductById(mockRequest, productId);

      expect(result).toEqual(mockProduct);
      expect(service.getProductById).toHaveBeenCalledWith('owner-1', productId);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const productId = 'product-1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 24.99,
      };
      const mockUpdatedProduct = { id: productId, ...updateProductDto };
      mockBusinessOwnerService.updateProduct.mockResolvedValue(
        mockUpdatedProduct,
      );

      const result = await controller.updateProduct(
        mockRequest,
        productId,
        updateProductDto,
      );

      expect(result).toEqual(mockUpdatedProduct);
      expect(service.updateProduct).toHaveBeenCalledWith(
        'owner-1',
        productId,
        updateProductDto,
      );
    });
  });

  describe('toggleProductStatus', () => {
    it('should toggle product status', async () => {
      const productId = 'product-1';
      const mockProduct = { id: productId, isActive: false };
      mockBusinessOwnerService.toggleProductStatus.mockResolvedValue(
        mockProduct,
      );

      const result = await controller.toggleProductStatus(
        mockRequest,
        productId,
      );

      expect(result).toEqual(mockProduct);
      expect(service.toggleProductStatus).toHaveBeenCalledWith(
        'owner-1',
        productId,
      );
    });
  });

  describe('getInventoryByBranch', () => {
    it('should return inventory for a branch', async () => {
      const branchId = 'branch-1';
      const mockInventory = [
        { id: 'inv-1', productId: 'product-1', quantity: 50 },
        { id: 'inv-2', productId: 'product-2', quantity: 30 },
      ];
      mockBusinessOwnerService.getInventoryByBranch.mockResolvedValue(
        mockInventory,
      );

      const result = await controller.getInventoryByBranch(
        mockRequest,
        branchId,
      );

      expect(result).toEqual(mockInventory);
      expect(service.getInventoryByBranch).toHaveBeenCalledWith(
        'owner-1',
        branchId,
      );
    });
  });

  describe('updateInventory', () => {
    it('should update inventory quantity', async () => {
      const inventoryId = 'inv-1';
      const quantity = 75;
      const mockUpdatedInventory = { id: inventoryId, quantity };
      mockBusinessOwnerService.updateInventory.mockResolvedValue(
        mockUpdatedInventory,
      );

      const result = await controller.updateInventory(
        mockRequest,
        inventoryId,
        quantity,
      );

      expect(result).toEqual(mockUpdatedInventory);
      expect(service.updateInventory).toHaveBeenCalledWith(
        'owner-1',
        inventoryId,
        quantity,
      );
    });
  });

  describe('getPOSTransactions', () => {
    it('should return POS transactions', async () => {
      const mockTransactions = [
        { id: 'trans-1', amount: 25.99, type: 'sale' },
        { id: 'trans-2', amount: 15.5, type: 'sale' },
      ];
      mockBusinessOwnerService.getPOSTransactions.mockResolvedValue(
        mockTransactions,
      );

      const result = await controller.getPOSTransactions(mockRequest);

      expect(result).toEqual(mockTransactions);
      expect(service.getPOSTransactions).toHaveBeenCalledWith(
        'owner-1',
        undefined,
      );
    });
  });

  describe('createPOSTransaction', () => {
    it('should create a POS transaction', async () => {
      const branchId = 'branch-1';
      const transactionData = {
        amount: 35.99,
        items: [{ productId: 'product-1', quantity: 2, price: 17.995 }],
      };
      const mockTransaction = { id: 'trans-1', ...transactionData, branchId };
      mockBusinessOwnerService.createPOSTransaction.mockResolvedValue(
        mockTransaction,
      );

      const result = await controller.createPOSTransaction(
        mockRequest,
        branchId,
        transactionData,
      );

      expect(result).toEqual(mockTransaction);
      expect(service.createPOSTransaction).toHaveBeenCalledWith(
        'owner-1',
        branchId,
        transactionData,
      );
    });
  });

  describe('getDefaultPOSSettings', () => {
    it('should return default POS settings', async () => {
      const mockSettings = {
        taxRate: 8.5,
        currency: 'USD',
        receiptTemplate: 'default',
      };
      mockBusinessOwnerService.getDefaultPOSSettings.mockResolvedValue(
        mockSettings,
      );

      const result = await controller.getDefaultPOSSettings(mockRequest);

      expect(result).toEqual(mockSettings);
      expect(service.getDefaultPOSSettings).toHaveBeenCalledWith('owner-1');
    });
  });

  describe('updatePOSSettings', () => {
    it('should update POS settings', async () => {
      const settings = {
        taxRate: 9.0,
        currency: 'USD',
        receiptTemplate: 'custom',
      };
      const mockUpdatedSettings = { ...settings };
      mockBusinessOwnerService.updatePOSSettings.mockResolvedValue(
        mockUpdatedSettings,
      );

      const result = await controller.updatePOSSettings(mockRequest, settings);

      expect(result).toEqual(mockUpdatedSettings);
      expect(service.updatePOSSettings).toHaveBeenCalledWith(
        'owner-1',
        settings,
      );
    });
  });
});
