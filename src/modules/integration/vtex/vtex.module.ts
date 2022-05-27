import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';

import * as redisStore from 'cache-manager-redis-store';

import { ProductModule } from '../../../modules/product/product.module';
import { VtexController } from './controllers/vtex.controller';
import { PrismaVtexRepository } from './providers/repos/prisma/vtex.repository';
import { ConnectVtexService } from './services/connect-vtex.service';
import { SyncProductVtexConsumer } from './services/sync-product-vtex.consumer';
import { SyncProductVtexService } from './services/sync-product-vtex.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    BullModule.registerQueue({
      name: 'vtex-products',
    }),
    HttpModule,
    ProductModule,
  ],
  providers: [
    ConnectVtexService,
    SyncProductVtexService,
    SyncProductVtexConsumer,
    { provide: 'VtexRepository', useClass: PrismaVtexRepository },
  ],
  exports: [],
  controllers: [VtexController],
})
export class VtexModule {}
