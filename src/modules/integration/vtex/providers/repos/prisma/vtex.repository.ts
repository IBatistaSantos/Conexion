import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateVtexAuthenticationParams,
  VtexRepositorys,
} from '../../../repository/vtex-authentication.repository';

@Injectable()
export class PrismaVtexRepository implements VtexRepositorys {
  constructor(private readonly prismaService: PrismaService) {}
  findByCompanyId(companyId: string): Promise<any> {
    return this.prismaService.vtex_Authentication.findFirst({
      where: {
        companyId,
      },
    });
  }
  create(params: CreateVtexAuthenticationParams): Promise<any> {
    const {
      companyId,
      appKey,
      appToken,
      integrationOrder,
      integrationProduct,
      stageId,
    } = params;
    return this.prismaService.vtex_Authentication.create({
      data: {
        companyId,
        appKey,
        appToken,
        integration_order: integrationOrder || false,
        integration_product: integrationProduct || false,
        stageId: stageId || undefined,
      },
    });
  }
}
