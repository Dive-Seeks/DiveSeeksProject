import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Coffee Beans',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality arabica coffee beans',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product SKU',
    example: 'PCB-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @ApiProperty({
    description: 'Product cost',
    example: 15.5,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  cost?: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Beverages',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Product barcode',
    example: '1234567890123',
    required: false,
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/product-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
