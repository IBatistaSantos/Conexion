import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Company } from 'src/modules/user/entities/company.entity';
import { CompanyRepository } from 'src/modules/user/repository';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(params: { name: string; ownerId: string }): Promise<Company> {
    const { id, name, ownerId } = await this.prismaService.company.create({
      data: {
        name: params.name,
        ownerId: params.ownerId,
      },
    });

    const company: Company = {
      id,
      name,
      ownerId,
    };
    return company;
  }

  async findByName(name: string): Promise<Company | undefined> {
    return this.prismaService.company.findFirst({
      where: {
        name,
      },
    });
  }
}
