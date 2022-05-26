import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProductModule } from 'src/modules/product/product.module';
import { VtexController } from './controllers/vtex.controller';
import { PrismaVtexRepository } from './providers/repos/prisma/vtex.repository';
import { ConnectVtexService } from './services/connect-vtex.service';
import { SyncProductVtexService } from './services/sync-product-vtex.service';

@Module({
  imports: [HttpModule, ProductModule],
  providers: [
    ConnectVtexService,
    SyncProductVtexService,
    { provide: 'VtexRepository', useClass: PrismaVtexRepository },
  ],
  exports: [],
  controllers: [VtexController],
})
export class VtexModule {}
