import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';

type DetailsProductServiceParams = {
  productId: string;
  companyId: string;
};

@Injectable()
export class DetailsProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(params: DetailsProductServiceParams): Promise<any> {
    const { productId, companyId } = params;
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.companyId !== companyId) {
      throw new UnauthorizedException(
        'You are not authorized to access this product',
      );
    }

    return product;
  }
}
