import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
} from '@nestjs/swagger';
import { SuperAdminService } from './super-admin.service';
import {
  CreateBrokerDto,
  UpdateBrokerDto,
  CreateBusinessOwnerDto,
  UpdateBusinessOwnerDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../shared/enums';

@ApiTags('Super Admin')
@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  // System Statistics
  @Get('stats')
  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({
    status: 200,
    description: 'System statistics retrieved successfully',
  })
  getSystemStats() {
    return this.superAdminService.getSystemStats();
  }

  // Broker Management
  @Post('brokers')
  @ApiOperation({ summary: 'Create a new broker' })
  @ApiBody({ type: CreateBrokerDto })
  @ApiResponse({ status: 201, description: 'Broker created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  createBroker(@Body() createBrokerDto: CreateBrokerDto) {
    return this.superAdminService.createBroker(createBrokerDto);
  }

  @Get('brokers')
  @ApiOperation({ summary: 'Get all brokers' })
  @ApiResponse({ status: 200, description: 'Brokers retrieved successfully' })
  getAllBrokers() {
    return this.superAdminService.getAllBrokers();
  }

  @Get('brokers/:id')
  @ApiOperation({ summary: 'Get broker by ID' })
  @ApiParam({ name: 'id', description: 'Broker ID' })
  @ApiResponse({ status: 200, description: 'Broker retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Broker not found' })
  getBrokerById(@Param('id') id: string) {
    return this.superAdminService.getBrokerById(id);
  }

  @Patch('brokers/:id')
  @ApiOperation({ summary: 'Update broker' })
  @ApiParam({ name: 'id', description: 'Broker ID' })
  @ApiBody({ type: UpdateBrokerDto })
  @ApiResponse({ status: 200, description: 'Broker updated successfully' })
  @ApiResponse({ status: 404, description: 'Broker not found' })
  updateBroker(
    @Param('id') id: string,
    @Body() updateBrokerDto: UpdateBrokerDto,
  ) {
    return this.superAdminService.updateBroker(id, updateBrokerDto);
  }

  @Delete('brokers/:id')
  @ApiOperation({ summary: 'Delete broker' })
  @ApiParam({ name: 'id', description: 'Broker ID' })
  @ApiResponse({ status: 204, description: 'Broker deleted successfully' })
  @ApiResponse({ status: 404, description: 'Broker not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBroker(@Param('id') id: string) {
    return this.superAdminService.deleteBroker(id);
  }

  @Patch('brokers/:id/toggle-status')
  @ApiOperation({ summary: 'Toggle broker status (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Broker ID' })
  @ApiResponse({
    status: 200,
    description: 'Broker status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Broker not found' })
  toggleBrokerStatus(@Param('id') id: string) {
    return this.superAdminService.toggleBrokerStatus(id);
  }

  // Business Owner Management
  @Post('business-owners')
  @ApiOperation({ summary: 'Create a new business owner' })
  @ApiBody({ type: CreateBusinessOwnerDto })
  @ApiResponse({
    status: 201,
    description: 'Business owner created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  createBusinessOwner(@Body() createBusinessOwnerDto: CreateBusinessOwnerDto) {
    return this.superAdminService.createBusinessOwner(createBusinessOwnerDto);
  }

  @Get('business-owners')
  @ApiOperation({ summary: 'Get all business owners' })
  @ApiResponse({
    status: 200,
    description: 'Business owners retrieved successfully',
  })
  getAllBusinessOwners() {
    return this.superAdminService.getAllBusinessOwners();
  }

  @Get('business-owners/:id')
  @ApiOperation({ summary: 'Get business owner by ID' })
  @ApiParam({ name: 'id', description: 'Business owner ID' })
  @ApiResponse({
    status: 200,
    description: 'Business owner retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Business owner not found' })
  getBusinessOwnerById(@Param('id') id: string) {
    return this.superAdminService.getBusinessOwnerById(id);
  }

  @Patch('business-owners/:id')
  @ApiOperation({ summary: 'Update business owner' })
  @ApiParam({ name: 'id', description: 'Business owner ID' })
  @ApiBody({ type: UpdateBusinessOwnerDto })
  @ApiResponse({
    status: 200,
    description: 'Business owner updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Business owner not found' })
  updateBusinessOwner(
    @Param('id') id: string,
    @Body() updateBusinessOwnerDto: UpdateBusinessOwnerDto,
  ) {
    return this.superAdminService.updateBusinessOwner(
      id,
      updateBusinessOwnerDto,
    );
  }

  @Delete('business-owners/:id')
  @ApiOperation({ summary: 'Delete business owner' })
  @ApiParam({ name: 'id', description: 'Business owner ID' })
  @ApiResponse({
    status: 204,
    description: 'Business owner deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Business owner not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBusinessOwner(@Param('id') id: string) {
    return this.superAdminService.deleteBusinessOwner(id);
  }

  @Patch('business-owners/:id/toggle-status')
  @ApiOperation({ summary: 'Toggle business owner status (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Business owner ID' })
  @ApiResponse({
    status: 200,
    description: 'Business owner status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Business owner not found' })
  toggleBusinessOwnerStatus(@Param('id') id: string) {
    return this.superAdminService.toggleBusinessOwnerStatus(id);
  }

  // Business Management
  @Get('businesses')
  @ApiOperation({ summary: 'Get all businesses' })
  @ApiResponse({
    status: 200,
    description: 'Businesses retrieved successfully',
  })
  getAllBusinesses() {
    return this.superAdminService.getAllBusinesses();
  }

  @Get('businesses/:id')
  @ApiOperation({ summary: 'Get business by ID' })
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  getBusinessById(@Param('id') id: string) {
    return this.superAdminService.getBusinessById(id);
  }

  @Patch('businesses/:id/toggle-status')
  @ApiOperation({ summary: 'Toggle business status (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Business ID' })
  @ApiResponse({
    status: 200,
    description: 'Business status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  toggleBusinessStatus(@Param('id') id: string) {
    return this.superAdminService.toggleBusinessStatus(id);
  }

  // Branch Management
  @Get('branches')
  @ApiOperation({ summary: 'Get all branches' })
  @ApiResponse({ status: 200, description: 'Branches retrieved successfully' })
  getAllBranches() {
    return this.superAdminService.getAllBranches();
  }

  @Get('branches/:id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Branch retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  getBranchById(@Param('id') id: string) {
    return this.superAdminService.getBranchById(id);
  }

  @Patch('branches/:id/toggle-status')
  @ApiOperation({ summary: 'Toggle branch status (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @ApiResponse({
    status: 200,
    description: 'Branch status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  toggleBranchStatus(@Param('id') id: string) {
    return this.superAdminService.toggleBranchStatus(id);
  }
}
