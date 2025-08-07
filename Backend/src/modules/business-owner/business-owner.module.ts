import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessOwnerController } from './business-owner.controller';
import { BusinessOwnerService } from './business-owner.service';
import {
  User,
  Business,
  Branch,
  Product,
  Inventory,
} from '../../database/entities';
import { UsersModule } from '../users/users.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { BranchesModule } from '../branches/branches.module';
import { ProductsModule } from '../products/products.module';
import { InventoryModule } from '../inventory/inventory.module';
import { PosModule } from '../pos/pos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Business, Branch, Product, Inventory]),
    UsersModule,
    BusinessesModule,
    BranchesModule,
    ProductsModule,
    InventoryModule,
    PosModule,
    AuthModule,
  ],
  controllers: [BusinessOwnerController],
  providers: [BusinessOwnerService],
  exports: [BusinessOwnerService],
})
export class BusinessOwnerModule {}
