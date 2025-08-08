import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyGuard } from './guards';
import { ApiKey, Client } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, Client])],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyGuard],
  exports: [ApiKeyService, ApiKeyGuard, TypeOrmModule],
})
export class ApiKeyModule {}
