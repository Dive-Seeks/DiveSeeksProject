import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({
    description: 'Business name',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Business email address',
    example: 'contact@acme.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Business phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Business address',
    example: '123 Main St, City, State 12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Business description',
    example: 'A leading provider of innovative solutions',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Business website URL',
    example: 'https://www.acme.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    description: 'Business industry',
    example: 'Technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  industry?: string;
}
