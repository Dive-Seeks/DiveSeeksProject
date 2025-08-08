import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, createHash } from 'crypto';
import { ApiKey, Client } from './entities';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

export interface GeneratedApiKey {
  id: string;
  name: string;
  key: string; // Plain text key (only returned once)
  keyPrefix: string;
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
}

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Generate a secure API key
   */
  private generateApiKey(): { key: string; prefix: string } {
    const prefix = 'dk_'; // DiveSeeks prefix
    const randomPart = randomBytes(32).toString('hex');
    const key = `${prefix}${randomPart}`;
    return { key, prefix };
  }

  /**
   * Hash an API key using SHA-256
   */
  private hashApiKey(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }

  /**
   * Create a new API key for a client
   */
  async create(createApiKeyDto: CreateApiKeyDto): Promise<GeneratedApiKey> {
    // Verify client exists
    const client = await this.clientRepository.findOne({
      where: { id: createApiKeyDto.clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Generate API key
    const { key, prefix } = this.generateApiKey();
    const hashedKey = this.hashApiKey(key);

    // Create API key entity
    const apiKey = this.apiKeyRepository.create({
      name: createApiKeyDto.name,
      hashedKey,
      keyPrefix: prefix,
      clientId: createApiKeyDto.clientId,
      expiresAt: createApiKeyDto.expiresAt,
    });

    const savedApiKey = await this.apiKeyRepository.save(apiKey);

    return {
      id: savedApiKey.id,
      name: savedApiKey.name,
      key, // Return plain text key only once
      keyPrefix: savedApiKey.keyPrefix,
      isActive: savedApiKey.isActive,
      expiresAt: savedApiKey.expiresAt,
      lastUsedAt: savedApiKey.lastUsedAt,
      createdAt: savedApiKey.createdAt,
      updatedAt: savedApiKey.updatedAt,
      clientId: savedApiKey.clientId,
    };
  }

  /**
   * Validate an API key
   */
  async validateApiKey(key: string): Promise<ApiKey | null> {
    if (!key || !key.startsWith('dk_')) {
      return null;
    }

    const hashedKey = this.hashApiKey(key);

    const apiKey = await this.apiKeyRepository.findOne({
      where: { hashedKey },
      relations: ['client'],
    });

    if (!apiKey) {
      return null;
    }

    // Check if key is active
    if (!apiKey.isActive) {
      return null;
    }

    // Check if key is expired
    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return null;
    }

    // Update last used timestamp
    await this.apiKeyRepository.update(apiKey.id, {
      lastUsedAt: new Date(),
    });

    return apiKey;
  }

  /**
   * Find all API keys for a client
   */
  async findAllByClient(clientId: string): Promise<ApiKey[]> {
    return this.apiKeyRepository.find({
      where: { clientId },
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find all API keys (admin only)
   */
  async findAll(): Promise<ApiKey[]> {
    return this.apiKeyRepository.find({
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find one API key by ID
   */
  async findOne(id: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    return apiKey;
  }

  /**
   * Update an API key
   */
  async update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKey> {
    const apiKey = await this.findOne(id);

    Object.assign(apiKey, updateApiKeyDto);
    return this.apiKeyRepository.save(apiKey);
  }

  /**
   * Deactivate an API key (soft delete)
   */
  async deactivate(id: string): Promise<ApiKey> {
    const apiKey = await this.findOne(id);
    apiKey.isActive = false;
    return this.apiKeyRepository.save(apiKey);
  }

  /**
   * Permanently remove an API key
   */
  async remove(id: string): Promise<void> {
    const result = await this.apiKeyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('API key not found');
    }
  }

  /**
   * Create a new client
   */
  async createClient(name: string, email: string): Promise<Client> {
    const client = this.clientRepository.create({ name, email });
    return this.clientRepository.save(client);
  }

  /**
   * Find all clients
   */
  async findAllClients(): Promise<Client[]> {
    return this.clientRepository.find({
      relations: ['apiKeys'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find one client by ID
   */
  async findOneClient(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['apiKeys'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }
}
