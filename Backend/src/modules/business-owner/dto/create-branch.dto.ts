import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Branch name',
    example: 'Downtown Branch',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Branch address',
    example: '456 Downtown Ave, City, State 12345',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Branch phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Branch email address',
    example: 'downtown@acme.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Branch manager name',
    example: 'John Manager',
    required: false,
  })
  @IsOptional()
  @IsString()
  managerName?: string;

  @ApiProperty({
    description: 'Branch description',
    example: 'Main downtown location',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
