import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { Cache } from 'cache-manager';
import { CreateProductService } from 'src/modules/product/services/create-product.service';
import { VtexApi } from '../entity/vtex-api';

@Processor('vtex-products')
@Injectable()
export class SyncProductVtexConsumer {
  constructor(
    private readonly httpService: HttpService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly createProductService: CreateProductService,
  ) {}

  @Process()
  async process(job: Job) {
    const { companyId, product, appKey, appToken } = job.data;

    const vtexApi = new VtexApi(appKey, appToken, this.httpService);

    const detailsProduct = await vtexApi.getProductAndSkuByProductId(product);

    if (!detailsProduct.success) return;

    const { productId, skus } = detailsProduct.data;

    const detailsProductVtex = await vtexApi.getProductById(productId);

    if (!detailsProductVtex.success) return;

    const { CategoryId: categoryId } = detailsProductVtex.data;

    const category = await vtexApi.getCategoryById(categoryId);

    const { Name: categoryName } = category.data;

    for (const productskus of skus) {
      const { sku: skuId, skuname: skuName } = productskus;
      const keyProduct = `${skuId}_${companyId}`;
      const priceSku = await vtexApi.getPriceBySkuId(skuId);

      if (!priceSku.success) {
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
        continue;
      }

      await this.cacheManager.set(keyProduct, true);
    }
  }
}
