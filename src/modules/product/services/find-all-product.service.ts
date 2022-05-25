import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';

type FindAllProductServiceParams = {
  companyId: string;
};

@Injectable()
export class FindAllProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute({ companyId }: FindAllProductServiceParams): Promise<any> {
    return this.productRepository.findAll(companyId);
  }
}
