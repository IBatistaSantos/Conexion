import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';

type FindDealProductServiceParams = {
  productId: string;
  companyId: string;
};

@Injectable()
export class FindDealProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}
  async execute(params: FindDealProductServiceParams): Promise<any> {
    const { companyId, productId } = params;
    const productInCompany = await this.productRepository.findById(productId);

    if (!productInCompany) {
      throw new NotFoundException('Product not found');
    }

    if (productInCompany.companyId !== companyId) {
      throw new UnauthorizedException('Product not in company');
    }

    return this.productRepository.findDealByProductId({
      productId,
      companyId,
    });
  }
}
