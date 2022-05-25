import { Module } from '@nestjs/common';
import { PersonModule } from '../person/person.module';
import { DealController } from './controllers/deal.controller';
import { PrismaDealRepository } from './provider/repos/prisma/deal.repository';
import { CreateDealService } from './services/create-deal.service';

@Module({
  imports: [PersonModule],
  controllers: [DealController],
  providers: [
    CreateDealService,
    { provide: 'DealRepository', useClass: PrismaDealRepository },
  ],
})
export class DealModule {}
