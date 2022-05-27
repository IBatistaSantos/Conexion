import { Module } from '@nestjs/common';
import { PersonModule } from '../person/person.module';
import { ProductModule } from '../product/product.module';
import { DealController } from './controllers/deal.controller';
import { PrismaDealRepository } from './provider/repos/prisma/deal.repository';
import { CreateDealService } from './services/create-deal.service';

@Module({
  imports: [PersonModule, ProductModule],
  controllers: [DealController],
  providers: [
    CreateDealService,
    { provide: 'DealRepository', useClass: PrismaDealRepository },
  ],
})
export class DealModule {}
