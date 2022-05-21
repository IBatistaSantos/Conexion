import { Injectable } from '@nestjs/common';
import { Company } from '../../../entities/company.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CompanyRepository,
  CreateCompany,
} from '../../../repository/company.repository';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(params: CreateCompany): Promise<Company> {
    return this.prismaService.company.create({
      data: {
        name: params.name,
        ownerId: params.ownerId,
      },
    });
  }
  findById(id: string): Promise<Company> {
    return this.prismaService.company.findUnique({
      where: {
        id,
      },
    });
  }
}
