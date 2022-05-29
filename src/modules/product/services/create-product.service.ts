import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PriceRepository } from '../repository/price.repository';
import { ProductRepository } from '../repository/product.repository';

type CreateProductServiceParams = {
  name: string;
  code: string;
  description?: string;
  category: string;
  companyId: string;
  prices: {
    price: number;
    currency: string;
    cost: number;
  };
};

@Injectable()
export class CreateProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,

    @Inject('PriceRepository')
    private readonly priceRepository: PriceRepository,
  ) {}

  async execute(params: CreateProductServiceParams): Promise<any> {
    const { code, companyId, name, description, prices, category } = params;

    const productExists = await this.productRepository.findByCode({
      code,
      companyId,
    });

    if (productExists) {
      throw new BadRequestException(`Product with code ${code} already exists`);
    }

    const product = await this.productRepository.create({
      name,
      code,
      description: description || undefined,
      category,
      companyId,
    });

    const price = await this.priceRepository.create({
      productId: product.id,
      cost: Number(prices.cost),
      currency: prices.currency,
      price: Number(prices.price),
    });

    return {
      id: product.id,
      name: product.name,
      code: product.code,
      description: product.description,
      prices: {
        price: price.price,
        currency: price.currency,
        cost: price.cost,
      },
    };
  }
}
