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
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { ApiKeyService } from './api-key.service';
import { ApiKeyGuard } from './guards';
import {
  CreateApiKeyDto,
  UpdateApiKeyDto,
  CreateClientDto,
  ApiKeyResponseDto,
  GeneratedApiKeyResponseDto,
} from './dto';

@ApiTags('API Keys')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  // API Key Management Endpoints

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Create a new API key',
    description:
      'Generate a new API key for a client. The plain text key is only returned once.',
  })
  @ApiResponse({
    status: 201,
    description: 'API key created successfully',
    type: GeneratedApiKeyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async create(
    @Body() createApiKeyDto: CreateApiKeyDto,
  ): Promise<GeneratedApiKeyResponseDto> {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Get all API keys',
    description: 'Retrieve all API keys (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all API keys',
    type: [ApiKeyResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<ApiKeyResponseDto[]> {
    return this.apiKeyService.findAll();
  }

  @Get('client/:clientId')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Get API keys by client',
    description: 'Retrieve all API keys for a specific client',
  })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of API keys for the client',
    type: [ApiKeyResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findByClient(
    @Param('clientId') clientId: string,
  ): Promise<ApiKeyResponseDto[]> {
    return this.apiKeyService.findAllByClient(clientId);
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Get API key by ID',
    description: 'Retrieve a specific API key by its ID',
  })
  @ApiParam({ name: 'id', description: 'API Key UUID' })
  @ApiResponse({
    status: 200,
    description: 'API key details',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async findOne(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Update API key',
    description: 'Update API key properties (name, expiration, active status)',
  })
  @ApiParam({ name: 'id', description: 'API Key UUID' })
  @ApiResponse({
    status: 200,
    description: 'API key updated successfully',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async update(
    @Param('id') id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.update(id, updateApiKeyDto);
  }

  @Patch(':id/deactivate')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Deactivate API key',
    description: 'Deactivate an API key (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'API Key UUID' })
  @ApiResponse({
    status: 200,
    description: 'API key deactivated successfully',
    type: ApiKeyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async deactivate(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.deactivate(id);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete API key',
    description: 'Permanently delete an API key',
  })
  @ApiParam({ name: 'id', description: 'API Key UUID' })
  @ApiResponse({ status: 204, description: 'API key deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.apiKeyService.remove(id);
  }

  // Client Management Endpoints

  @Public()
  @Post('clients')
  @ApiOperation({
    summary: 'Create a new client',
    description: 'Create a new client that can have API keys',
  })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.apiKeyService.createClient(
      createClientDto.name,
      createClientDto.email,
    );
  }

  @Get('clients')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Get all clients',
    description: 'Retrieve all clients with their API keys',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all clients',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllClients() {
    return this.apiKeyService.findAllClients();
  }

  @Get('clients/:id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Get client by ID',
    description: 'Retrieve a specific client with their API keys',
  })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  @ApiResponse({
    status: 200,
    description: 'Client details with API keys',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOneClient(@Param('id') id: string) {
    return this.apiKeyService.findOneClient(id);
  }
}
