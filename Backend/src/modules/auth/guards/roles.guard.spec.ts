import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../../shared/enums';
import { ROLES_KEY } from '../../../common/decorators';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: UserRole.BUSINESS_OWNER,
        },
      };

      mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as any;
    });

    it('should allow access when no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
    });

    it('should allow access when user has required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has one of multiple required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.SUPER_ADMIN,
        UserRole.BUSINESS_OWNER,
        UserRole.BROKER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should deny access when user role is not in required roles list', () => {
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.SUPER_ADMIN,
        UserRole.BROKER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle missing user in request', () => {
      mockRequest.user = undefined;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle user without role property', () => {
      mockRequest.user = {
        id: 'user-1',
        email: 'test@example.com',
        // role property is missing
      };
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should work with SUPER_ADMIN role', () => {
      mockRequest.user.role = UserRole.SUPER_ADMIN;
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should work with BROKER role', () => {
      mockRequest.user.role = UserRole.BROKER;
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.BROKER]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should work with BRANCH_MANAGER role', () => {
      mockRequest.user.role = UserRole.BRANCH_MANAGER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BRANCH_MANAGER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should work with CASHIER role', () => {
      mockRequest.user.role = UserRole.CASHIER;
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.CASHIER]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should work with KITCHEN_STAFF role', () => {
      mockRequest.user.role = UserRole.KITCHEN_STAFF;
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.KITCHEN_STAFF]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should work with DELIVERY_DRIVER role', () => {
      mockRequest.user.role = UserRole.DELIVERY_DRIVER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.DELIVERY_DRIVER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should work with INVENTORY_MANAGER role', () => {
      mockRequest.user.role = UserRole.INVENTORY_MANAGER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.INVENTORY_MANAGER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should work with FINANCE_MANAGER role', () => {
      mockRequest.user.role = UserRole.FINANCE_MANAGER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.FINANCE_MANAGER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should handle empty roles array', () => {
      mockReflector.getAllAndOverride.mockReturnValue([]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should be case sensitive for role comparison', () => {
      mockRequest.user.role = 'business_owner'; // lowercase
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]); // uppercase

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle multiple roles requirement with complex scenario', () => {
      // User is BUSINESS_OWNER, but endpoint requires SUPER_ADMIN or BROKER
      mockRequest.user.role = UserRole.BUSINESS_OWNER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.SUPER_ADMIN,
        UserRole.BROKER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should allow SUPER_ADMIN access to BROKER endpoints', () => {
      mockRequest.user.role = UserRole.SUPER_ADMIN;
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.BROKER]);

      // Note: This test assumes SUPER_ADMIN should NOT automatically have access
      // to BROKER endpoints unless explicitly specified. If your business logic
      // requires SUPER_ADMIN to have access to all endpoints, modify the guard accordingly.
      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle null role value', () => {
      mockRequest.user.role = null;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle undefined role value', () => {
      mockRequest.user.role = undefined;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });
  });

  describe('role hierarchy scenarios', () => {
    let mockContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        user: {
          id: 'user-1',
          email: 'test@example.com',
        },
      };

      mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as any;
    });

    it('should handle business owner accessing their own resources', () => {
      mockRequest.user.role = UserRole.BUSINESS_OWNER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should handle broker accessing business owner resources', () => {
      mockRequest.user.role = UserRole.BROKER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.BUSINESS_OWNER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should handle super admin accessing any resources', () => {
      mockRequest.user.role = UserRole.SUPER_ADMIN;
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.SUPER_ADMIN]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should handle staff roles accessing appropriate resources', () => {
      mockRequest.user.role = UserRole.CASHIER;
      mockReflector.getAllAndOverride.mockReturnValue([
        UserRole.CASHIER,
        UserRole.BRANCH_MANAGER,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });
});
