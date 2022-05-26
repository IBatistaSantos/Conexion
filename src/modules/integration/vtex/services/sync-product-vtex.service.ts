import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductService } from 'src/modules/product/services/create-product.service';
import { VtexApi } from '../entity/vtex-api';
import { VtexRepositorys } from '../repository/vtex-authentication.repository';

type SyncProductVtexServiceParams = {
  companyId: string;
};

@Injectable()
export class SyncProductVtexService {
  constructor(
    @Inject('VtexRepository') private readonly vtexRepository: VtexRepositorys,
    private readonly httpService: HttpService,
    private readonly createProductService: CreateProductService,
  ) {}

  async execute(params: SyncProductVtexServiceParams) {
    const { companyId } = params;
    let _to = 50;
    let _from = 1;
    let totalProduct = 1;
    let productsAtVtex = [];
    const productsIntegrated = [];

    const authentication = await this.vtexRepository.findByCompanyId(companyId);

    if (!authentication) {
      throw new NotFoundException('Authentication not found');
    }

    if (!authentication.integration_product) {
      throw new BadRequestException('Integration Product not connected');
    }

    const vtexApi = new VtexApi(
      authentication.appKey,
      authentication.appToken,
      this.httpService,
    );

    while (totalProduct !== 0) {
      const { data: products } = await vtexApi.getProducts(_from, _to);
      productsAtVtex = products.data;

      if (!productsAtVtex.length) {
        totalProduct = 0;
        break;
      }

      for (const product of productsAtVtex) {
        const detailsProduct = await vtexApi.getProductAndSkuByProductId(
          product,
        );

        if (!detailsProduct.success) {
          const data = {
            message: `Product with id ${product} not found at Vtex`,
            ...detailsProduct,
          };

          productsIntegrated.push(data);
          continue;
        }

        const { productId, skus } = detailsProduct.data;

        const detailsProductVtex = await vtexApi.getProductById(productId);

        if (!detailsProductVtex.success) {
          const data = {
            message: 'Error: Product not found at Vtex',
            ...detailsProductVtex,
          };

          productsIntegrated.push(data);
          continue;
        }

        const { CategoryId: categoryId } = detailsProductVtex.data;

        const category = await vtexApi.getCategoryById(categoryId);

        const { Name: categoryName } = category.data;

        for (const productskus of skus) {
          const { sku: skuId, skuname: skuName } = productskus;

          const priceSku = await vtexApi.getPriceBySkuId(skuId);

          if (!priceSku.success) {
            const data = {
              success: false,
              message: `Error: Sku Price with id ${skuId} not found at Vtex`,
              data: priceSku,
            };

            productsIntegrated.push(data);
            continue;
          }

          const { listPrice, costPrice } = priceSku.data;

          const productVtex = {
            companyId,
            name: skuName,
            description: skuName,
            code: String(skuId),
            category: categoryName,
            prices: {
              cost: costPrice,
              currency: 'BRA',
              price: listPrice,
            },
          };

          const productCreated = await this.createProductService.execute(
            productVtex,
          );

          if (!productCreated) {
            const data = {
              success: false,
              data: productCreated,
              message: `Error: Product with id ${skuId} not created`,
            };

            productsIntegrated.push(data);
            continue;
          }

          productsIntegrated.push({
            success: true,
            message: `Success: Product with id ${productCreated.id} created`,
            data: productCreated,
          });

          continue;
        }
      }

      _from += 50;
      _to += 50;
      totalProduct = productsAtVtex.length;
    }

    const successProducts = productsIntegrated.filter(
      (product) => product.success,
    );

    const failedProducts = productsIntegrated.filter(
      (product) => !product.success,
    );

    return {
      success: {
        products: successProducts,
        total: successProducts.length,
      },
      failed: {
        products: failedProducts,
        total: failedProducts.length,
      },
      total: productsIntegrated.length,
    };
  }
}
