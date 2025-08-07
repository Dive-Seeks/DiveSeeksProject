import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../database/entities';
import { UserRole, UserStatus } from '../../../shared/enums';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../../shared/interfaces';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: Repository<User>;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.BUSINESS_OWNER,
    status: UserStatus.ACTIVE,
    emailVerifiedAt: new Date(),
    lastLoginAt: new Date(),
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // Mock the JWT secret
    mockConfigService.get.mockReturnValue('test-jwt-secret');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when payload is valid and user exists', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      const inactiveUser = {
        ...mockUser,
        status: UserStatus.INACTIVE,
      };

      mockUserRepository.findOne.mockResolvedValue(inactiveUser);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is suspended', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      const suspendedUser = {
        ...mockUser,
        status: UserStatus.SUSPENDED,
      };

      mockUserRepository.findOne.mockResolvedValue(suspendedUser);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user account is locked', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      const lockedUser = {
        ...mockUser,
        lockedUntil: new Date(Date.now() + 3600000), // Locked for 1 hour
      };

      mockUserRepository.findOne.mockResolvedValue(lockedUser);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user when account was locked but lock has expired', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      const previouslyLockedUser = {
        ...mockUser,
        lockedUntil: new Date(Date.now() - 3600000), // Lock expired 1 hour ago
      };

      mockUserRepository.findOne.mockResolvedValue(previouslyLockedUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(previouslyLockedUser);
    });

    it('should work with SUPER_ADMIN role', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'admin@example.com',
        role: UserRole.SUPER_ADMIN,
      };

      const adminUser = {
        ...mockUser,
        role: UserRole.SUPER_ADMIN,
        email: 'admin@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(adminUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(adminUser);
    });

    it('should work with BROKER role', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'broker@example.com',
        role: UserRole.BROKER,
      };

      const brokerUser = {
        ...mockUser,
        role: UserRole.BROKER,
        email: 'broker@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(brokerUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(brokerUser);
    });

    it('should work with BRANCH_MANAGER role', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'manager@example.com',
        role: UserRole.BRANCH_MANAGER,
        branchId: 'branch-1',
      };

      const managerUser = {
        ...mockUser,
        role: UserRole.BRANCH_MANAGER,
        email: 'manager@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(managerUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(managerUser);
    });

    it('should work with CASHIER role', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'cashier@example.com',
        role: UserRole.CASHIER,
        branchId: 'branch-1',
      };

      const cashierUser = {
        ...mockUser,
        role: UserRole.CASHIER,
        email: 'cashier@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(cashierUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(cashierUser);
    });

    it('should work with payload containing businessId', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'owner@example.com',
        role: UserRole.BUSINESS_OWNER,
        businessId: 'business-1',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
    });

    it('should work with payload containing both businessId and branchId', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'manager@example.com',
        role: UserRole.BRANCH_MANAGER,
        businessId: 'business-1',
        branchId: 'branch-1',
      };

      const managerUser = {
        ...mockUser,
        role: UserRole.BRANCH_MANAGER,
        email: 'manager@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(managerUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(managerUser);
    });

    it('should handle database errors gracefully', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      mockUserRepository.findOne.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(strategy.validate(payload)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle malformed payload gracefully', async () => {
      const payload = {
        // Missing required fields
        email: 'test@example.com',
      } as any;

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle empty payload', async () => {
      const payload = {} as any;

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle null payload', async () => {
      const payload = null as any;

      await expect(strategy.validate(payload)).rejects.toThrow();
    });

    it('should handle undefined payload', async () => {
      const payload = undefined as any;

      await expect(strategy.validate(payload)).rejects.toThrow();
    });

    it('should verify email verification status', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      const unverifiedUser = {
        ...mockUser,
        emailVerifiedAt: null,
      };

      mockUserRepository.findOne.mockResolvedValue(unverifiedUser);

      // Depending on your business logic, you might want to allow or deny unverified users
      // This test assumes unverified users are allowed, but you can modify as needed
      const result = await strategy.validate(payload);

      expect(result).toEqual(unverifiedUser);
    });

    it('should handle user with high failed login attempts but not locked', async () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: UserRole.BUSINESS_OWNER,
      };

      const userWithFailedAttempts = {
        ...mockUser,
        failedLoginAttempts: 4, // High but below lock threshold
        lockedUntil: null,
      };

      mockUserRepository.findOne.mockResolvedValue(userWithFailedAttempts);

      const result = await strategy.validate(payload);

      expect(result).toEqual(userWithFailedAttempts);
    });
  });

  describe('constructor', () => {
    it('should initialize with correct JWT options', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
