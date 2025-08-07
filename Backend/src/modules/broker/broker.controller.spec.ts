import { Test, TestingModule } from '@nestjs/testing';
import { BrokerController } from './broker.controller';
import { BrokerService } from './broker.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import {
  CreateBusinessOwnerDto,
  UpdateBusinessOwnerDto,
  CreateBusinessDto,
  UpdateBusinessDto,
  UpdateBrokerProfileDto,
} from './dto';
import { UserRole } from '../../shared/enums';

describe('BrokerController', () => {
  let controller: BrokerController;
  let service: BrokerService;

  const mockBrokerService = {
    getBrokerProfile: jest.fn(),
    updateBrokerProfile: jest.fn(),
    getBrokerStats: jest.fn(),
    createBusinessOwner: jest.fn(),
    getMyBusinessOwners: jest.fn(),
    getBusinessOwnerById: jest.fn(),
    updateBusinessOwner: jest.fn(),
    createBusiness: jest.fn(),
    getMyBusinesses: jest.fn(),
    getBusinessById: jest.fn(),
    updateBusiness: jest.fn(),
    toggleBusinessStatus: jest.fn(),
    getFundingApplications: jest.fn(),
    createFundingApplication: jest.fn(),
    getFundingRates: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRequest = {
    user: {
      id: 'broker-1',
      email: 'broker@test.com',
      role: UserRole.BROKER,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerController],
      providers: [
        {
          provide: BrokerService,
          useValue: mockBrokerService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<BrokerController>(BrokerController);
    service = module.get<BrokerService>(BrokerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return broker profile', async () => {
      const mockProfile = {
        id: 'broker-1',
        email: 'broker@test.com',
        firstName: 'John',
        lastName: 'Broker',
        role: UserRole.BROKER,
      };
      mockBrokerService.getBrokerProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockProfile);
      expect(service.getBrokerProfile).toHaveBeenCalledWith('broker-1');
    });
  });

  describe('updateProfile', () => {
    it('should update broker profile', async () => {
      const updateProfileDto: UpdateBrokerProfileDto = {
        firstName: 'Updated',
        lastName: 'Broker',
        phone: '+1234567890',
      };
      const mockUpdatedProfile = { id: 'broker-1', ...updateProfileDto };
      mockBrokerService.updateBrokerProfile.mockResolvedValue(
        mockUpdatedProfile,
      );

      const result = await controller.updateProfile(
        mockRequest,
        updateProfileDto,
      );

      expect(result).toEqual(mockUpdatedProfile);
      expect(service.updateBrokerProfile).toHaveBeenCalledWith(
        'broker-1',
        updateProfileDto,
      );
    });
  });

  describe('getStats', () => {
    it('should return broker statistics', async () => {
      const mockStats = {
        totalBusinessOwners: 10,
        totalBusinesses: 8,
        totalRevenue: 5000,
        activeBusinesses: 7,
      };
      mockBrokerService.getBrokerStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(mockRequest);

      expect(result).toEqual(mockStats);
      expect(service.getBrokerStats).toHaveBeenCalledWith('broker-1');
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
      };
      const mockBusinessOwner = {
        id: 'owner-1',
        ...createBusinessOwnerDto,
        role: UserRole.BUSINESS_OWNER,
      };
      mockBrokerService.createBusinessOwner.mockResolvedValue(
        mockBusinessOwner,
      );

      const result = await controller.createBusinessOwner(
        mockRequest,
        createBusinessOwnerDto,
      );

      expect(result).toEqual(mockBusinessOwner);
      expect(service.createBusinessOwner).toHaveBeenCalledWith(
        'broker-1',
        createBusinessOwnerDto,
      );
    });
  });

  describe('getMyBusinessOwners', () => {
    it('should return all business owners for the broker', async () => {
      const mockBusinessOwners = [
        {
          id: 'owner-1',
          email: 'owner1@test.com',
          role: UserRole.BUSINESS_OWNER,
        },
        {
          id: 'owner-2',
          email: 'owner2@test.com',
          role: UserRole.BUSINESS_OWNER,
        },
      ];
      mockBrokerService.getMyBusinessOwners.mockResolvedValue(
        mockBusinessOwners,
      );

      const result = await controller.getMyBusinessOwners(mockRequest);

      expect(result).toEqual(mockBusinessOwners);
      expect(service.getMyBusinessOwners).toHaveBeenCalledWith('broker-1');
    });
  });

  describe('getBusinessOwnerById', () => {
    it('should return a business owner by ID', async () => {
      const ownerId = 'owner-1';
      const mockBusinessOwner = {
        id: ownerId,
        email: 'owner@test.com',
        role: UserRole.BUSINESS_OWNER,
      };
      mockBrokerService.getBusinessOwnerById.mockResolvedValue(
        mockBusinessOwner,
      );

      const result = await controller.getBusinessOwnerById(
        mockRequest,
        ownerId,
      );

      expect(result).toEqual(mockBusinessOwner);
      expect(service.getBusinessOwnerById).toHaveBeenCalledWith(
        'broker-1',
        ownerId,
      );
    });
  });

  describe('updateBusinessOwner', () => {
    it('should update a business owner', async () => {
      const ownerId = 'owner-1';
      const updateBusinessOwnerDto: UpdateBusinessOwnerDto = {
        firstName: 'Updated',
        lastName: 'Owner',
      };
      const mockUpdatedBusinessOwner = {
        id: ownerId,
        ...updateBusinessOwnerDto,
      };
      mockBrokerService.updateBusinessOwner.mockResolvedValue(
        mockUpdatedBusinessOwner,
      );

      const result = await controller.updateBusinessOwner(
        mockRequest,
        ownerId,
        updateBusinessOwnerDto,
      );

      expect(result).toEqual(mockUpdatedBusinessOwner);
      expect(service.updateBusinessOwner).toHaveBeenCalledWith(
        'broker-1',
        ownerId,
        updateBusinessOwnerDto,
      );
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
      mockBrokerService.createBusiness.mockResolvedValue(mockBusiness);

      const result = await controller.createBusiness(
        mockRequest,
        'owner-1',
        createBusinessDto,
      );

      expect(result).toEqual(mockBusiness);
      expect(service.createBusiness).toHaveBeenCalledWith(
        'broker-1',
        'owner-1',
        createBusinessDto,
      );
    });
  });

  describe('getMyBusinesses', () => {
    it('should return all businesses for the broker', async () => {
      const mockBusinesses = [
        { id: 'business-1', name: 'Restaurant 1' },
        { id: 'business-2', name: 'Restaurant 2' },
      ];
      mockBrokerService.getMyBusinesses.mockResolvedValue(mockBusinesses);

      const result = await controller.getMyBusinesses(mockRequest);

      expect(result).toEqual(mockBusinesses);
      expect(service.getMyBusinesses).toHaveBeenCalledWith('broker-1');
    });
  });

  describe('getBusinessById', () => {
    it('should return a business by ID', async () => {
      const businessId = 'business-1';
      const mockBusiness = { id: businessId, name: 'Test Restaurant' };
      mockBrokerService.getBusinessById.mockResolvedValue(mockBusiness);

      const result = await controller.getBusinessById(mockRequest, businessId);

      expect(result).toEqual(mockBusiness);
      expect(service.getBusinessById).toHaveBeenCalledWith(
        'broker-1',
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
      mockBrokerService.updateBusiness.mockResolvedValue(mockUpdatedBusiness);

      const result = await controller.updateBusiness(
        mockRequest,
        businessId,
        updateBusinessDto,
      );

      expect(result).toEqual(mockUpdatedBusiness);
      expect(service.updateBusiness).toHaveBeenCalledWith(
        'broker-1',
        businessId,
        updateBusinessDto,
      );
    });
  });

  describe('toggleBusinessStatus', () => {
    it('should toggle business status', async () => {
      const businessId = 'business-1';
      const mockBusiness = { id: businessId, status: 'active' };
      mockBrokerService.toggleBusinessStatus.mockResolvedValue(mockBusiness);

      const result = await controller.toggleBusinessStatus(
        mockRequest,
        businessId,
      );

      expect(result).toEqual(mockBusiness);
      expect(service.toggleBusinessStatus).toHaveBeenCalledWith(
        'broker-1',
        businessId,
      );
    });
  });

  describe('getFundingApplications', () => {
    it('should return funding applications', async () => {
      const mockApplications = [
        {
          id: 'app-1',
          businessId: 'business-1',
          amount: 10000,
          status: 'pending',
        },
        {
          id: 'app-2',
          businessId: 'business-2',
          amount: 15000,
          status: 'approved',
        },
      ];
      mockBrokerService.getFundingApplications.mockResolvedValue(
        mockApplications,
      );

      const result = await controller.getFundingApplications(mockRequest);

      expect(result).toEqual(mockApplications);
      expect(service.getFundingApplications).toHaveBeenCalledWith('broker-1');
    });
  });

  describe('createFundingApplication', () => {
    it('should create a funding application', async () => {
      const applicationData = {
        businessId: 'business-1',
        amount: 10000,
        purpose: 'Equipment purchase',
      };
      const mockApplication = {
        id: 'app-1',
        ...applicationData,
        status: 'pending',
      };
      mockBrokerService.createFundingApplication.mockResolvedValue(
        mockApplication,
      );

      const result = await controller.createFundingApplication(
        mockRequest,
        'business-1',
        applicationData,
      );

      expect(result).toEqual(mockApplication);
      expect(service.createFundingApplication).toHaveBeenCalledWith(
        'broker-1',
        'business-1',
        applicationData,
      );
    });
  });

  describe('getFundingRates', () => {
    it('should return funding rates', async () => {
      const mockRates = {
        baseRate: 5.5,
        premiumRate: 4.5,
        riskFactors: ['credit_score', 'business_age', 'revenue'],
      };
      mockBrokerService.getFundingRates.mockResolvedValue(mockRates);

      const result = await controller.getFundingRates(mockRequest);

      expect(result).toEqual(mockRates);
      expect(service.getFundingRates).toHaveBeenCalledWith('broker-1');
    });
  });
});
