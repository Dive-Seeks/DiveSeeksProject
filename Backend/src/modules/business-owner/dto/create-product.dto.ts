import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Coffee Beans',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Product cost price',
    example: 15.5,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  costPrice?: number;

  @ApiProperty({
    description: 'Product category ID',
    example: 'uuid-category-id',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Product barcode',
    example: '1234567890123',
    required: false,
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    description: 'Product image URLs',
    example: ['https://example.com/product-image.jpg'],
    required: false,
  })
  @IsOptional()
  imageUrls?: string[];
}
