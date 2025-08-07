import { ConfigService } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  maxFileSize: number;
  uploadDest: string;
  throttleTtl: number;
  throttleLimit: number;
}

export const getAppConfig = (configService: ConfigService): AppConfig => ({
  port: configService.get<number>('PORT') || 3000,
  nodeEnv: configService.get<string>('NODE_ENV') || 'development',
  maxFileSize: configService.get<number>('MAX_FILE_SIZE') || 10485760, // 10MB
  uploadDest: configService.get<string>('UPLOAD_DEST') || './uploads',
  throttleTtl: configService.get<number>('THROTTLE_TTL') || 60,
  throttleLimit: configService.get<number>('THROTTLE_LIMIT') || 10,
});
