import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BrokerService } from './broker.service';
import {
  CreateBusinessOwnerDto,
  UpdateBusinessOwnerDto,
  CreateBusinessDto,
  UpdateBusinessDto,
  UpdateBrokerProfileDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../shared/enums';

@ApiTags('Broker')
@Controller('broker')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BROKER)
@ApiBearerAuth()
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  // Broker Profile Management
  @Get('profile')
  @ApiOperation({ summary: 'Get broker profile' })
  @ApiResponse({
    status: 200,
    description: 'Broker profile retrieved successfully',
  })
  getBrokerProfile(@Request() req) {
    return this.brokerService.getBrokerProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update broker profile' })
  @ApiBody({ type: UpdateBrokerProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Broker profile updated successfully',
  })
  updateBrokerProfile(
    @Request() req,
    @Body() updateBrokerProfileDto: UpdateBrokerProfileDto,
  ) {
    return this.brokerService.updateBrokerProfile(
      req.user.id,
      updateBrokerProfileDto,
    );
  }

  // Statistics
  @Get('stats')
  @ApiOperation({ summary: 'Get broker statistics' })
  @ApiResponse({
    status: 200,
    description: 'Broker statistics retrieved successfully',
  })
  getBrokerStats(@Request() req) {
    return this.brokerService.getBrokerStats(req.user.id);
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
  createBusinessOwner(
    @Request() req,
    @Body() createBusinessOwnerDto: CreateBusinessOwnerDto,
  ) {
    return this.brokerService.createBusinessOwner(
      req.user.id,
      createBusinessOwnerDto,
    );
  }

  @Get('business-owners')
  @ApiOperation({ summary: 'Get all business owners managed by this broker' })
  @ApiResponse({
    status: 200,
    description: 'Business owners retrieved successfully',
  })
  getMyBusinessOwners(@Request() req) {
    return this.brokerService.getMyBusinessOwners(req.user.id);
  }

  @Get('business-owners/:ownerId')
  @ApiOperation({ summary: 'Get business owner by ID' })
  @ApiParam({ name: 'ownerId', description: 'Business owner ID' })
  @ApiResponse({
    status: 200,
    description: 'Business owner retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Business owner not found' })
  getBusinessOwnerById(@Request() req, @Param('ownerId') ownerId: string) {
    return this.brokerService.getBusinessOwnerById(req.user.id, ownerId);
  }

  @Patch('business-owners/:ownerId')
  @ApiOperation({ summary: 'Update business owner' })
  @ApiParam({ name: 'ownerId', description: 'Business owner ID' })
  @ApiBody({ type: UpdateBusinessOwnerDto })
  @ApiResponse({
    status: 200,
    description: 'Business owner updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Business owner not found' })
  updateBusinessOwner(
    @Request() req,
    @Param('ownerId') ownerId: string,
    @Body() updateBusinessOwnerDto: UpdateBusinessOwnerDto,
  ) {
    return this.brokerService.updateBusinessOwner(
      req.user.id,
      ownerId,
      updateBusinessOwnerDto,
    );
  }

  // Business Management
  @Post('business-owners/:ownerId/businesses')
  @ApiOperation({ summary: 'Create a business for a business owner' })
  @ApiParam({ name: 'ownerId', description: 'Business owner ID' })
  @ApiBody({ type: CreateBusinessDto })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 404, description: 'Business owner not found' })
  createBusiness(
    @Request() req,
    @Param('ownerId') ownerId: string,
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    return this.brokerService.createBusiness(
      req.user.id,
      ownerId,
      createBusinessDto,
    );
  }

  @Get('businesses')
  @ApiOperation({ summary: 'Get all businesses managed by this broker' })
  @ApiResponse({
    status: 200,
    description: 'Businesses retrieved successfully',
  })
  getMyBusinesses(@Request() req) {
    return this.brokerService.getMyBusinesses(req.user.id);
  }

  @Get('businesses/:businessId')
  @ApiOperation({ summary: 'Get business by ID' })
  @ApiParam({ name: 'businessId', description: 'Business ID' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  getBusinessById(@Request() req, @Param('businessId') businessId: string) {
    return this.brokerService.getBusinessById(req.user.id, businessId);
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
    return this.brokerService.updateBusiness(
      req.user.id,
      businessId,
      updateBusinessDto,
    );
  }

  @Patch('businesses/:businessId/toggle-status')
  @ApiOperation({ summary: 'Toggle business status (active/inactive)' })
  @ApiParam({ name: 'businessId', description: 'Business ID' })
  @ApiResponse({
    status: 200,
    description: 'Business status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  toggleBusinessStatus(
    @Request() req,
    @Param('businessId') businessId: string,
  ) {
    return this.brokerService.toggleBusinessStatus(req.user.id, businessId);
  }

  // Funding Management
  @Get('funding/applications')
  @ApiOperation({ summary: 'Get funding applications' })
  @ApiResponse({
    status: 200,
    description: 'Funding applications retrieved successfully',
  })
  getFundingApplications(@Request() req) {
    return this.brokerService.getFundingApplications(req.user.id);
  }

  @Post('businesses/:businessId/funding/applications')
  @ApiOperation({ summary: 'Create funding application for a business' })
  @ApiParam({ name: 'businessId', description: 'Business ID' })
  @ApiResponse({
    status: 201,
    description: 'Funding application created successfully',
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  createFundingApplication(
    @Request() req,
    @Param('businessId') businessId: string,
    @Body() applicationData: any,
  ) {
    return this.brokerService.createFundingApplication(
      req.user.id,
      businessId,
      applicationData,
    );
  }

  @Get('funding/rates')
  @ApiOperation({ summary: 'Get current funding rates' })
  @ApiResponse({
    status: 200,
    description: 'Funding rates retrieved successfully',
  })
  getFundingRates(@Request() req) {
    return this.brokerService.getFundingRates(req.user.id);
  }
}
