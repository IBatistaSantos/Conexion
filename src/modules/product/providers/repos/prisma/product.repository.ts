import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateProductParams,
  FindByCodeAndCompanyId,
  ProductRepository,
} from 'src/modules/product/repository/product.repository';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findByCode(params: FindByCodeAndCompanyId): Promise<any> {
    const { code, companyId } = params;
    return this.prismaService.product.findFirst({
      where: {
        code,
        AND: {
          companyId,
        },
      },
    });
  }
  create(params: CreateProductParams): Promise<any> {
    const { name, category, companyId, description, code } = params;
    return this.prismaService.product.create({
      data: {
        name,
        code,
        description: description || undefined,
        category,
        companyId,
      },
    });
  }
}
