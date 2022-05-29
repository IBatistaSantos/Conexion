import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';

import * as redisStore from 'cache-manager-redis-store';
import { PersonModule } from '../../../modules/person/person.module';
import { DealModule } from '../../../modules/deal/deal.module';

import { ProductModule } from '../../../modules/product/product.module';
import { VtexController } from './controllers/vtex.controller';
import { PrismaVtexRepository } from './providers/repos/prisma/vtex.repository';
import { ConnectVtexService } from './services/connect-vtex.service';
import { SyncOrderVtexService } from './services/sync-order-vtex.service';
import { SyncProductVtexConsumer } from './services/sync-product-vtex.consumer';
import { SyncProductVtexService } from './services/sync-product-vtex.service';
import { SyncOrderVtexConsumer } from './services/sync-order-vtex.consumer';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 0,
    }),
    BullModule.registerQueue(
      {
        name: 'vtex-orders',
      },
      {
        name: 'vtex-products',
      },
    ),
    HttpModule,
    ProductModule,
    PersonModule,
    DealModule,
  ],
  providers: [
    ConnectVtexService,
    SyncProductVtexService,
    SyncOrderVtexService,
    SyncProductVtexConsumer,
    SyncOrderVtexConsumer,

    { provide: 'VtexRepository', useClass: PrismaVtexRepository },
  ],
  exports: [],
  controllers: [VtexController],
})
export class VtexModule {}
