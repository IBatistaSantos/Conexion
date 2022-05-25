import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { PrismaPriceRepository } from './providers/repos/prisma/price.repository';
import { PrismaProductRepository } from './providers/repos/prisma/product.repository';
import { CreateProductService } from './services/create-product.service';
import { DetailsProductService } from './services/details-product.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    CreateProductService,
    DetailsProductService,
    { provide: 'ProductRepository', useClass: PrismaProductRepository },
    { provide: 'PriceRepository', useClass: PrismaPriceRepository },
  ],
})
export class ProductModule {}
