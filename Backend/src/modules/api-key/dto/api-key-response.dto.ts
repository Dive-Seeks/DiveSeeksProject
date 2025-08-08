import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ApiKeyResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the API key',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the API key',
    example: 'Production API Key',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Prefix of the API key (for identification)',
    example: 'dk_',
  })
  @Expose()
  keyPrefix: string;

  @ApiProperty({
    description: 'Whether the API key is active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Expiration date of the API key',
    example: '2024-12-31T23:59:59.000Z',
  })
  @Expose()
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Last time the API key was used',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  lastUsedAt?: Date;

  @ApiProperty({
    description: 'Creation date of the API key',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the API key',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'Client ID associated with this API key',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  clientId: string;

  // Exclude sensitive data
  @Exclude()
  hashedKey?: string;
}

export class GeneratedApiKeyResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the API key',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the API key',
    example: 'Production API Key',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The generated API key (only shown once)',
    example:
      'dk_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  })
  @Expose()
  key: string;

  @ApiProperty({
    description: 'Prefix of the API key (for identification)',
    example: 'dk_',
  })
  @Expose()
  keyPrefix: string;

  @ApiProperty({
    description: 'Whether the API key is active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Expiration date of the API key',
    example: '2024-12-31T23:59:59.000Z',
  })
  @Expose()
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Last time the API key was used',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  lastUsedAt?: Date;

  @ApiProperty({
    description: 'Creation date of the API key',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the API key',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'Client ID associated with this API key',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  clientId: string;
}
