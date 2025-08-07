import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateBusinessOwnerDto {
  @ApiProperty({
    description: 'Business owner email address',
    example: 'owner@business.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Business owner password',
    example: 'NewSecurePassword123!',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'Business owner first name',
    example: 'Jane',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Business owner last name',
    example: 'Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Business owner phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Assigned broker ID',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  brokerId?: string;
}
