import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
  },
});

export const getJwtRefreshConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_REFRESH_SECRET'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
  },
});
