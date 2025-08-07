import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateBusinessOwnerDto {
  @ApiProperty({
    description: 'Business owner email address',
    example: 'owner@business.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Business owner password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Business owner first name',
    example: 'Jane',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Business owner last name',
    example: 'Smith',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Business owner phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
