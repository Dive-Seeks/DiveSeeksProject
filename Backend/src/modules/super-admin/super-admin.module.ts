import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { User, Business, Branch } from '../../database/entities';
import { UsersModule } from '../users/users.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { BranchesModule } from '../branches/branches.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Business, Branch]),
    UsersModule,
    BusinessesModule,
    BranchesModule,
    AuthModule,
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}
