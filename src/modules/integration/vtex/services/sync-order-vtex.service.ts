import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { subDays, toDate } from 'date-fns';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { VtexApi } from '../entity/vtex-api';
import { VtexRepositorys } from '../repository/vtex-authentication.repository';

type SyncOrderVtexServiceParams = {
  companyId: string;
  userId: string;
};

@Injectable()
export class SyncOrderVtexService {
  constructor(
    @Inject('VtexRepository') private readonly vtexRepository: VtexRepositorys,
    private readonly httpService: HttpService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectQueue('vtex-orders')
    private readonly orderVtexQueue: Queue,
  ) {}

  async execute(params: SyncOrderVtexServiceParams) {
    const { companyId, userId } = params;
    const since = subDays(new Date(), 10).toISOString();
    const today = toDate(new Date()).toISOString();
    let page = 1;
    const perPage = 50;
    let hasOrderVtex = true;
    let ordersAtVtex = [];

    const authentication = await this.vtexRepository.findByCompanyId(companyId);

    if (!authentication) {
      throw new NotFoundException('Authentication not found');
    }

    if (!authentication.integration_order) {
      throw new BadRequestException('Integration Order not connected');
    }

    const vtexApi = new VtexApi(
      authentication.appKey,
      authentication.appToken,
      this.httpService,
    );

    while (hasOrderVtex) {
      const { data: orders } = await vtexApi.getOrders({
        page,
        perPage,
        since,
        today,
      });

      ordersAtVtex = orders.list;

      if (!ordersAtVtex.length) {
        hasOrderVtex = false;
        break;
      }

      for (const order of ordersAtVtex) {
        const keyOrder = `${companyId}-${order.orderId}`;

        const orderProcessed = await this.cacheManager.get(keyOrder);

        if (orderProcessed) {
          continue;
        }

        const detailsOrders = await vtexApi.getOrderById(order.orderId);

        if (!detailsOrders.success) continue;

        await this.orderVtexQueue.add({
          companyId,
          order: detailsOrders.data,
          userId,
          appKey: authentication.appKey,
          appToken: authentication.appToken,
        });
      }

      page += 1;
    }
  }
}
