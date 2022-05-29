import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateProductParams,
  FindByCodeAndCompanyId,
  FindDealByProductId,
  ProductRepository,
} from 'src/modules/product/repository/product.repository';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findDealByProductId(params: FindDealByProductId): Promise<any> {
    const { companyId, productId } = params;
    return this.prismaService.product.findMany({
      where: {
        id: productId,
        AND: {
          companyId,
        },
      },
      include: {
        prices: {
          select: {
            id: true,
            cost: true,
            currency: true,
            price: true,
          },
        },
        deals: true,
        _count: {
          select: {
            deals: true,
          },
        },
      },
    });
  }
  findAll(companyId: string): Promise<any> {
    return this.prismaService.product.findMany({
      where: {
        companyId,
      },
      include: {
        prices: {
          select: {
            id: true,
            cost: true,
            currency: true,
            price: true,
          },
        },
        _count: {
          select: {
            deals: true,
          },
        },
      },
    });
  }
  findById(productId: string): Promise<any> {
    return this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        prices: {
          select: {
            id: true,
            cost: true,
            currency: true,
            price: true,
          },
        },
      },
    });
  }
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
  async create(params: CreateProductParams): Promise<any> {
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
