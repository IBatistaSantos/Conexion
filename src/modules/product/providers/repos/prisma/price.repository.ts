import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreatePriceParams,
  PriceRepository,
} from '../../../repository/price.repository';

@Injectable()
export class PrismaPriceRepository implements PriceRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(params: CreatePriceParams): Promise<any> {
    const { productId, cost, currency, price } = params;
    return this.prismaService.price.create({
      data: {
        productId,
        cost,
        currency,
        price,
      },
    });
  }
}
