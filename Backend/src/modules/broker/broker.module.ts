import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokerController } from './broker.controller';
import { BrokerService } from './broker.service';
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
  controllers: [BrokerController],
  providers: [BrokerService],
  exports: [BrokerService],
})
export class BrokerModule {}
