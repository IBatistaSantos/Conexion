import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { FindByCodeProductService } from '../../../../modules/product/services/find-by-code.service';
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

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectQueue('vtex-products')
    private readonly productVtexQueue: Queue,

    private readonly findByCodeProductService: FindByCodeProductService,
  ) {}

  async execute(params: SyncProductVtexServiceParams) {
    const { companyId } = params;
    let _to = 50;
    let _from = 1;
    let totalProduct = 1;
    let productsAtVtex = [];

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

        if (!detailsProduct.success) return;

        const { skus } = detailsProduct.data;

        for (const productskus of skus) {
          const keyProduct = `${productskus.sku}_${companyId}`;

          const skuAlreadyIntegrated =
            await this.findByCodeProductService.execute({
              companyId,
              code: product,
            });

          if (skuAlreadyIntegrated) {
            await this.cacheManager.set(keyProduct, true);
            continue;
          }

          await this.productVtexQueue.add({
            companyId,
            product,
            appKey: authentication.appKey,
            appToken: authentication.appToken,
          });

          continue;
        }
      }

      _from += 50;
      _to += 50;
      totalProduct = productsAtVtex.length;
    }
  }
}
