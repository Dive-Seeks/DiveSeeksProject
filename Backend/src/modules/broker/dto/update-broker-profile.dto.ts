import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class UpdateBrokerProfileDto {
  @ApiProperty({
    description: 'Broker email address',
    example: 'broker@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Broker password',
    example: 'NewSecurePassword123!',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'Broker first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Broker last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Broker phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Broker avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
