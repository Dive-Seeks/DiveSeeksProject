import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
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

    beforeEach(() => {
      mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'Bearer valid-jwt-token',
            },
          }),
        }),
      } as any;
    });

    it('should allow access to public routes', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const _result = guard.canActivate(mockContext);

      expect(_result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
    });

    it('should call parent canActivate for protected routes', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const parentCanActivate = jest.spyOn(
        AuthGuard('jwt').prototype,
        'canActivate',
      );
      parentCanActivate.mockReturnValue(true);

      const _result = guard.canActivate(mockContext);

      expect(parentCanActivate).toHaveBeenCalledWith(mockContext);
    });

    it('should handle missing authorization header', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      });

      const parentCanActivate = jest.spyOn(
        AuthGuard('jwt').prototype,
        'canActivate',
      );
      parentCanActivate.mockReturnValue(false);

      const _result = guard.canActivate(mockContext);

      expect(parentCanActivate).toHaveBeenCalledWith(mockContext);
    });

    it('should handle invalid token format', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'InvalidFormat',
          },
        }),
      });

      const parentCanActivate = jest.spyOn(
        AuthGuard('jwt').prototype,
        'canActivate',
      );
      parentCanActivate.mockReturnValue(false);

      const _result = guard.canActivate(mockContext);

      expect(parentCanActivate).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('handleRequest', () => {
    it('should return user when authentication is successful', () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'BUSINESS_OWNER',
      };

      const result = guard.handleRequest(null, mockUser, null);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when authentication fails', () => {
      expect(() => {
        guard.handleRequest(new Error('Invalid token'), null, null);
      }).toThrow('Unauthorized');
    });

    it('should throw UnauthorizedException when user is not found', () => {
      expect(() => {
        guard.handleRequest(null, null, null);
      }).toThrow('Unauthorized');
    });

    it('should handle token expiration error', () => {
      const tokenExpiredError = new Error('jwt expired');
      tokenExpiredError.name = 'TokenExpiredError';

      expect(() => {
        guard.handleRequest(tokenExpiredError, null, null);
      }).toThrow('Unauthorized');
    });

    it('should handle malformed token error', () => {
      const malformedError = new Error('jwt malformed');
      malformedError.name = 'JsonWebTokenError';

      expect(() => {
        guard.handleRequest(malformedError, null, null);
      }).toThrow('Unauthorized');
    });
  });
});
