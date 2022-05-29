import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { Cache } from 'cache-manager';
import { CreateDealService } from '../../../../modules/deal/services/create-deal.service';
import { CreateProductService } from '../../../..//modules/product/services/create-product.service';
import { FindByCodeProductService } from '../../../..//modules/product/services/find-by-code.service';

import { CreatePersonService } from 'src/modules/person/services/create-person.service';
import { FindByEmailPersonService } from 'src/modules/person/services/find-person-by-email.service';

type FindOrCreatePersonFromDeal = {
  email: string;
  order: any;
  userId: string;
  companyId: string;
};
@Processor('vtex-orders')
@Injectable()
export class SyncOrderVtexConsumer {
  constructor(
    private readonly httpService: HttpService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly createDealService: CreateDealService,

    private readonly findProductService: FindByCodeProductService,
    private readonly createProductService: CreateProductService,

    private readonly findPersonService: FindByEmailPersonService,
    private readonly createPersonService: CreatePersonService,
  ) {}

  @Process()
  async process(job: Job) {
    const { companyId, order, appKey, appToken, userId, stageId } = job.data;

    const keyOrder = `${companyId}-${order.orderId}`;

    const productId = await this.findOrCreateProductFromDeal(order, companyId);

    const [emailFormatted] = order.clientProfileData.email.split('-');

    const personId = await this.findOrCreatePersonFromDeal({
      email: emailFormatted,
      companyId,
      order,
      userId,
    });

    const createDealParams = {
      title: `Pedido Vtex: ${order.orderId}`,
      stageId,
      creatorId: userId,
      companyId,
      personId,
      productId,
    };

    await this.createDealService.execute(createDealParams);

    await this.cacheManager.set(keyOrder, true);
  }

  private async findOrCreateProductFromDeal(
    order: any,
    companyId: string,
  ): Promise<string> {
    const product = order.items[0];

    const productFound = await this.findProductService.execute({
      companyId,
      code: product.id,
    });

    if (!productFound) {
      const created = await this.createProductService.execute({
        category: product.categories[0].name,
        code: product.id,
        companyId,
        name: product.name,
        prices: {
          cost: product.costPrice,
          price: product.price,
          currency: 'BRA',
        },
      });

      return created.id;
    }

    return productFound.id;
  }

  private async findOrCreatePersonFromDeal(
    params: FindOrCreatePersonFromDeal,
  ): Promise<string> {
    const { email, order, userId, companyId } = params;
    const personFound = await this.findPersonService.execute({
      email,
    });

    if (!personFound) {
      const createdPerson = await this.createPersonService.execute({
        email,
        name: `${order.clientProfileData.firstName} ${order.clientProfileData.lastName}`,
        userId,
        companyId,
      });

      return createdPerson.id;
    }
    return personFound.id;
  }
}
