import { Test, TestingModule } from '@nestjs/testing';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import {
  CreateBrokerDto,
  UpdateBrokerDto,
  CreateBusinessOwnerDto,
  UpdateBusinessOwnerDto,
} from './dto';
import { UserRole } from '../../shared/enums';

describe('SuperAdminController', () => {
  let controller: SuperAdminController;
  let service: SuperAdminService;

  const mockSuperAdminService = {
    getSystemStats: jest.fn(),
    createBroker: jest.fn(),
    getAllBrokers: jest.fn(),
    getBrokerById: jest.fn(),
    updateBroker: jest.fn(),
    deleteBroker: jest.fn(),
    toggleBrokerStatus: jest.fn(),
    createBusinessOwner: jest.fn(),
    getAllBusinessOwners: jest.fn(),
    getBusinessOwnerById: jest.fn(),
    updateBusinessOwner: jest.fn(),
    deleteBusinessOwner: jest.fn(),
    toggleBusinessOwnerStatus: jest.fn(),
    getAllBusinesses: jest.fn(),
    getBusinessById: jest.fn(),
    toggleBusinessStatus: jest.fn(),
    getAllBranches: jest.fn(),
    getBranchById: jest.fn(),
    toggleBranchStatus: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperAdminController],
      providers: [
        {
          provide: SuperAdminService,
          useValue: mockSuperAdminService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<SuperAdminController>(SuperAdminController);
    service = module.get<SuperAdminService>(SuperAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSystemStats', () => {
    it('should return system statistics', async () => {
      const mockStats = {
        totalUsers: 100,
        totalBrokers: 10,
        totalBusinessOwners: 50,
        totalBusinesses: 40,
        totalBranches: 80,
      };
      mockSuperAdminService.getSystemStats.mockResolvedValue(mockStats);

      const result = await controller.getSystemStats();

      expect(result).toEqual(mockStats);
      expect(service.getSystemStats).toHaveBeenCalled();
    });
  });

  describe('createBroker', () => {
    it('should create a new broker', async () => {
      const createBrokerDto: CreateBrokerDto = {
        email: 'broker@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Broker',
        phone: '+1234567890',
      };
      const mockBroker = { id: '1', ...createBrokerDto, role: UserRole.BROKER };
      mockSuperAdminService.createBroker.mockResolvedValue(mockBroker);

      const result = await controller.createBroker(createBrokerDto);

      expect(result).toEqual(mockBroker);
      expect(service.createBroker).toHaveBeenCalledWith(createBrokerDto);
    });
  });

  describe('getAllBrokers', () => {
    it('should return all brokers', async () => {
      const mockBrokers = [
        { id: '1', email: 'broker1@test.com', role: UserRole.BROKER },
        { id: '2', email: 'broker2@test.com', role: UserRole.BROKER },
      ];
      mockSuperAdminService.getAllBrokers.mockResolvedValue(mockBrokers);

      const result = await controller.getAllBrokers();

      expect(result).toEqual(mockBrokers);
      expect(service.getAllBrokers).toHaveBeenCalled();
    });
  });

  describe('getBrokerById', () => {
    it('should return a broker by ID', async () => {
      const brokerId = '1';
      const mockBroker = {
        id: brokerId,
        email: 'broker@test.com',
        role: UserRole.BROKER,
      };
      mockSuperAdminService.getBrokerById.mockResolvedValue(mockBroker);

      const result = await controller.getBrokerById(brokerId);

      expect(result).toEqual(mockBroker);
      expect(service.getBrokerById).toHaveBeenCalledWith(brokerId);
    });
  });

  describe('updateBroker', () => {
    it('should update a broker', async () => {
      const brokerId = '1';
      const updateBrokerDto: UpdateBrokerDto = {
        firstName: 'Updated',
        lastName: 'Broker',
      };
      const mockUpdatedBroker = { id: brokerId, ...updateBrokerDto };
      mockSuperAdminService.updateBroker.mockResolvedValue(mockUpdatedBroker);

      const result = await controller.updateBroker(brokerId, updateBrokerDto);

      expect(result).toEqual(mockUpdatedBroker);
      expect(service.updateBroker).toHaveBeenCalledWith(
        brokerId,
        updateBrokerDto,
      );
    });
  });

  describe('deleteBroker', () => {
    it('should delete a broker', async () => {
      const brokerId = '1';
      mockSuperAdminService.deleteBroker.mockResolvedValue(undefined);

      await controller.deleteBroker(brokerId);

      expect(service.deleteBroker).toHaveBeenCalledWith(brokerId);
    });
  });

  describe('toggleBrokerStatus', () => {
    it('should toggle broker status', async () => {
      const brokerId = '1';
      const mockBroker = { id: brokerId, status: 'active' };
      mockSuperAdminService.toggleBrokerStatus.mockResolvedValue(mockBroker);

      const result = await controller.toggleBrokerStatus(brokerId);

      expect(result).toEqual(mockBroker);
      expect(service.toggleBrokerStatus).toHaveBeenCalledWith(brokerId);
    });
  });

  describe('createBusinessOwner', () => {
    it('should create a new business owner', async () => {
      const createBusinessOwnerDto: CreateBusinessOwnerDto = {
        email: 'owner@test.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Owner',
        phone: '+1234567891',
        brokerId: 'broker-1',
      };
      const mockBusinessOwner = {
        id: '1',
        ...createBusinessOwnerDto,
        role: UserRole.BUSINESS_OWNER,
      };
      mockSuperAdminService.createBusinessOwner.mockResolvedValue(
        mockBusinessOwner,
      );

      const result = await controller.createBusinessOwner(
        createBusinessOwnerDto,
      );

      expect(result).toEqual(mockBusinessOwner);
      expect(service.createBusinessOwner).toHaveBeenCalledWith(
        createBusinessOwnerDto,
      );
    });
  });

  describe('getAllBusinessOwners', () => {
    it('should return all business owners', async () => {
      const mockBusinessOwners = [
        { id: '1', email: 'owner1@test.com', role: UserRole.BUSINESS_OWNER },
        { id: '2', email: 'owner2@test.com', role: UserRole.BUSINESS_OWNER },
      ];
      mockSuperAdminService.getAllBusinessOwners.mockResolvedValue(
        mockBusinessOwners,
      );

      const result = await controller.getAllBusinessOwners();

      expect(result).toEqual(mockBusinessOwners);
      expect(service.getAllBusinessOwners).toHaveBeenCalled();
    });
  });

  describe('getBusinessOwnerById', () => {
    it('should return a business owner by ID', async () => {
      const ownerId = '1';
      const mockBusinessOwner = {
        id: ownerId,
        email: 'owner@test.com',
        role: UserRole.BUSINESS_OWNER,
      };
      mockSuperAdminService.getBusinessOwnerById.mockResolvedValue(
        mockBusinessOwner,
      );

      const result = await controller.getBusinessOwnerById(ownerId);

      expect(result).toEqual(mockBusinessOwner);
      expect(service.getBusinessOwnerById).toHaveBeenCalledWith(ownerId);
    });
  });

  describe('updateBusinessOwner', () => {
    it('should update a business owner', async () => {
      const ownerId = '1';
      const updateBusinessOwnerDto: UpdateBusinessOwnerDto = {
        firstName: 'Updated',
        lastName: 'Owner',
      };
      const mockUpdatedBusinessOwner = {
        id: ownerId,
        ...updateBusinessOwnerDto,
      };
      mockSuperAdminService.updateBusinessOwner.mockResolvedValue(
        mockUpdatedBusinessOwner,
      );

      const result = await controller.updateBusinessOwner(
        ownerId,
        updateBusinessOwnerDto,
      );

      expect(result).toEqual(mockUpdatedBusinessOwner);
      expect(service.updateBusinessOwner).toHaveBeenCalledWith(
        ownerId,
        updateBusinessOwnerDto,
      );
    });
  });

  describe('deleteBusinessOwner', () => {
    it('should delete a business owner', async () => {
      const ownerId = '1';
      mockSuperAdminService.deleteBusinessOwner.mockResolvedValue(undefined);

      await controller.deleteBusinessOwner(ownerId);

      expect(service.deleteBusinessOwner).toHaveBeenCalledWith(ownerId);
    });
  });

  describe('toggleBusinessOwnerStatus', () => {
    it('should toggle business owner status', async () => {
      const ownerId = '1';
      const mockBusinessOwner = { id: ownerId, status: 'active' };
      mockSuperAdminService.toggleBusinessOwnerStatus.mockResolvedValue(
        mockBusinessOwner,
      );

      const result = await controller.toggleBusinessOwnerStatus(ownerId);

      expect(result).toEqual(mockBusinessOwner);
      expect(service.toggleBusinessOwnerStatus).toHaveBeenCalledWith(ownerId);
    });
  });
});
