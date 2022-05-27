import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';

type FindByCodeServiceParams = {
  code: string;
  companyId: string;
};

@Injectable()
export class FindByCodeProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(params: FindByCodeServiceParams): Promise<any> {
    const { code, companyId } = params;
    const product = await this.productRepository.findByCode({
      code,
      companyId,
    });

    if (!product) {
      return false;
    }

    return product;
  }
}
