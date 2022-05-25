import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  prices: {
    price: number;
    currency: string;
    cost: number;
  };
}
