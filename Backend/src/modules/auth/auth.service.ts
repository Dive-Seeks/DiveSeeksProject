import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserSession, PasswordResetToken } from '../../database/entities';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UserResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto';
import { UserStatus } from '../../shared/enums';
import { JwtPayload, RefreshTokenPayload } from '../../shared/interfaces';
import {
  hashPassword,
  comparePassword,
} from '../../common/utils/password.util';
import { APP_CONSTANTS } from '../../shared/constants';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private userSessionRepository: Repository<UserSession>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      role,
      status: UserStatus.PENDING_VERIFICATION,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    // Create user session
    await this.createUserSession(savedUser.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.mapUserToResponseDto(savedUser),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new UnauthorizedException(
        `Account is locked until ${user.lockedUntil.toISOString()}`,
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Reset failed login attempts and update last login
    await this.handleSuccessfulLogin(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create user session
    await this.createUserSession(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.mapUserToResponseDto(user),
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const _payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      // Find user session
      const userSession = await this.userSessionRepository.findOne({
        where: {
          refreshToken,
          isActive: true,
        },
        relations: ['user'],
      });

      if (!userSession || !userSession.isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(userSession.user);

      // Update user session with new refresh token
      userSession.refreshToken = tokens.refreshToken;
      userSession.lastUsedAt = new Date();
      await this.userSessionRepository.save(userSession);

      return {
        ...tokens,
        user: this.mapUserToResponseDto(userSession.user),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.userSessionRepository.update(
      {
        userId,
        refreshToken,
      },
      {
        isActive: false,
      },
    );
  }

  async logoutAll(userId: string): Promise<void> {
    await this.userSessionRepository.update({ userId }, { isActive: false });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Save reset token
    const passwordResetToken = this.passwordResetTokenRepository.create({
      userId: user.id,
      token: resetToken,
      expiresAt,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // TODO: Send email with reset token
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password } = resetPasswordDto;

    // Find valid reset token
    const resetTokenRecord = await this.passwordResetTokenRepository.findOne({
      where: {
        token,
        isUsed: false,
      },
      relations: ['user'],
    });

    if (!resetTokenRecord || !resetTokenRecord.isValid) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await this.userRepository.update(resetTokenRecord.userId, {
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    // Mark token as used
    resetTokenRecord.isUsed = true;
    resetTokenRecord.usedAt = new Date();
    await this.passwordResetTokenRepository.save(resetTokenRecord);

    // Invalidate all user sessions
    await this.logoutAll(resetTokenRecord.userId);
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      tokenId: randomBytes(16).toString('hex'),
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: APP_CONSTANTS.JWT.ACCESS_TOKEN_EXPIRY,
    };
  }

  private async createUserSession(
    userId: string,
    refreshToken: string,
  ): Promise<UserSession> {
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + APP_CONSTANTS.JWT.REFRESH_TOKEN_EXPIRY,
    );

    const userSession = this.userSessionRepository.create({
      userId,
      refreshToken,
      expiresAt,
      isActive: true,
    });

    return this.userSessionRepository.save(userSession);
  }

  private async handleFailedLogin(user: User): Promise<void> {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= APP_CONSTANTS.SECURITY.MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = new Date();
      user.lockedUntil.setMinutes(
        user.lockedUntil.getMinutes() +
          APP_CONSTANTS.SECURITY.ACCOUNT_LOCK_DURATION,
      );
    }

    await this.userRepository.save(user);
  }

  private async handleSuccessfulLogin(user: User): Promise<void> {
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();

    await this.userRepository.save(user);
  }

  private mapUserToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
