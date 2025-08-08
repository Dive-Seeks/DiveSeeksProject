import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { BusinessOwnerService } from './business-owner.service';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  CreateBranchDto,
  UpdateBranchDto,
  CreateProductDto,
  UpdateProductDto,
  UpdateBusinessOwnerProfileDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../shared/enums';

@ApiTags('Business Owner')
@Controller('business-owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BUSINESS_OWNER)
@ApiBearerAuth()
export class BusinessOwnerController {
  constructor(private readonly businessOwnerService: BusinessOwnerService) {}

  // Profile Management
  @Get('profile')
  @ApiOperation({ summary: 'Get business owner profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getProfile(@Request() req) {
    return this.businessOwnerService.getBusinessOwnerProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update business owner profile' })
  @ApiBody({ type: UpdateBusinessOwnerProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateBusinessOwnerProfileDto,
  ) {
    return this.businessOwnerService.updateBusinessOwnerProfile(
      req.user.id,
      updateProfileDto,
    );
  }

  // Statistics
  @Get('stats')
  @ApiOperation({ summary: 'Get business owner statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getStats(@Request() req) {
    return this.businessOwnerService.getBusinessOwnerStats(req.user.id);
  }

  // Business Management
  @Post('businesses')
  @ApiOperation({ summary: 'Create a new business' })
  @ApiBody({ type: CreateBusinessDto })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createBusiness(@Request() req, @Body() createBusinessDto: CreateBusinessDto) {
    return this.businessOwnerService.createBusiness(
      req.user.id,
      createBusinessDto,
    );
  }

  @Get('businesses')
  @ApiOperation({ summary: 'Get all businesses owned by this user' })
  @ApiResponse({
    status: 200,
    description: 'Businesses retrieved successfully',
  })
  getMyBusinesses(@Request() req) {
    return this.businessOwnerService.getMyBusinesses(req.user.id);
  }

  @Get('businesses/:businessId')
  @ApiOperation({ summary: 'Get business by ID' })
  @ApiParam({ name: 'businessId', description: 'Business ID' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  getBusinessById(@Request() req, @Param('businessId') businessId: string) {
    return this.businessOwnerService.getBusinessById(req.user.id, businessId);
  }

  @Patch('businesses/:businessId')
  @ApiOperation({ summary: 'Update business' })
  @ApiParam({ name: 'businessId', description: 'Business ID' })
  @ApiBody({ type: UpdateBusinessDto })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  updateBusiness(
    @Request() req,
    @Param('businessId') businessId: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessOwnerService.updateBusiness(
      req.user.id,
      businessId,
      updateBusinessDto,
    );
  }

  // Branch Management
  @Post('businesses/:businessId/branches')
  @ApiOperation({ summary: 'Create a new branch for a business' })
  @ApiParam({ name: 'businessId', description: 'Business ID' })
  @ApiBody({ type: CreateBranchDto })
  @ApiResponse({ status: 201, description: 'Branch created successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  createBranch(
    @Request() req,
    @Param('businessId') businessId: string,
    @Body() createBranchDto: CreateBranchDto,
  ) {
    return this.businessOwnerService.createBranch(
      req.user.id,
      businessId,
      createBranchDto,
    );
  }

  @Get('branches')
  @ApiOperation({ summary: 'Get all branches owned by this user' })
  @ApiQuery({
    name: 'businessId',
    description: 'Filter by business ID',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Branches retrieved successfully' })
  getMyBranches(@Request() req, @Query('businessId') businessId?: string) {
    return this.businessOwnerService.getMyBranches(req.user.id, businessId);
  }

  @Get('branches/:branchId')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Branch retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  getBranchById(@Request() req, @Param('branchId') branchId: string) {
    return this.businessOwnerService.getBranchById(req.user.id, branchId);
  }

  @Patch('branches/:branchId')
  @ApiOperation({ summary: 'Update branch' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiBody({ type: UpdateBranchDto })
  @ApiResponse({ status: 200, description: 'Branch updated successfully' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  updateBranch(
    @Request() req,
    @Param('branchId') branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.businessOwnerService.updateBranch(
      req.user.id,
      branchId,
      updateBranchDto,
    );
  }

  @Patch('branches/:branchId/toggle-status')
  @ApiOperation({ summary: 'Toggle branch status (active/inactive)' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiResponse({
    status: 200,
    description: 'Branch status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  toggleBranchStatus(@Request() req, @Param('branchId') branchId: string) {
    return this.businessOwnerService.toggleBranchStatus(req.user.id, branchId);
  }

  // Product Management
  @Post('businesses/:businessId/products')
  @ApiOperation({ summary: 'Create a new product for a business' })
  @ApiParam({ name: 'businessId', description: 'Business ID' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  createProduct(
    @Request() req,
    @Param('businessId') businessId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.businessOwnerService.createProduct(
      req.user.id,
      businessId,
      createProductDto,
    );
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products owned by this user' })
  @ApiQuery({
    name: 'businessId',
    description: 'Filter by business ID',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  getMyProducts(@Request() req, @Query('businessId') businessId?: string) {
    return this.businessOwnerService.getMyProducts(req.user.id, businessId);
  }

  @Get('products/:productId')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProductById(@Request() req, @Param('productId') productId: string) {
    return this.businessOwnerService.getProductById(req.user.id, productId);
  }

  @Patch('products/:productId')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateProduct(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.businessOwnerService.updateProduct(
      req.user.id,
      productId,
      updateProductDto,
    );
  }

  @Patch('products/:productId/toggle-status')
  @ApiOperation({ summary: 'Toggle product status (active/inactive)' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  toggleProductStatus(@Request() req, @Param('productId') productId: string) {
    return this.businessOwnerService.toggleProductStatus(
      req.user.id,
      productId,
    );
  }

  // Inventory Management
  @Get('branches/:branchId/inventory')
  @ApiOperation({ summary: 'Get inventory for a branch' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Inventory retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  getInventoryByBranch(@Request() req, @Param('branchId') branchId: string) {
    return this.businessOwnerService.getInventoryByBranch(
      req.user.id,
      branchId,
    );
  }

  @Patch('inventory/:inventoryId')
  @ApiOperation({ summary: 'Update inventory quantity' })
  @ApiParam({ name: 'inventoryId', description: 'Inventory ID' })
  @ApiBody({
    schema: { type: 'object', properties: { quantity: { type: 'number' } } },
  })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  updateInventory(
    @Request() req,
    @Param('inventoryId') inventoryId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.businessOwnerService.updateInventory(
      req.user.id,
      inventoryId,
      quantity,
    );
  }

  // POS Operations
  @Get('pos/transactions')
  @ApiOperation({ summary: 'Get POS transactions' })
  @ApiQuery({
    name: 'branchId',
    description: 'Filter by branch ID',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'POS transactions retrieved successfully',
  })
  getPOSTransactions(@Request() req, @Query('branchId') branchId?: string) {
    return this.businessOwnerService.getPOSTransactions(req.user.id, branchId);
  }

  @Post('branches/:branchId/pos/transactions')
  @ApiOperation({ summary: 'Create a new POS transaction' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiResponse({
    status: 201,
    description: 'POS transaction created successfully',
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  createPOSTransaction(
    @Request() req,
    @Param('branchId') branchId: string,
    @Body() transactionData: any,
  ) {
    return this.businessOwnerService.createPOSTransaction(
      req.user.id,
      branchId,
      transactionData,
    );
  }

  // POS Settings
  @Get('pos/settings')
  @ApiOperation({ summary: 'Get default POS settings' })
  @ApiResponse({
    status: 200,
    description: 'POS settings retrieved successfully',
  })
  getDefaultPOSSettings(@Request() req) {
    return this.businessOwnerService.getDefaultPOSSettings(req.user.id);
  }

  @Patch('pos/settings')
  @ApiOperation({ summary: 'Update POS settings' })
  @ApiResponse({
    status: 200,
    description: 'POS settings updated successfully',
  })
  updatePOSSettings(@Request() req, @Body() settings: any) {
    return this.businessOwnerService.updatePOSSettings(req.user.id, settings);
  }
}
