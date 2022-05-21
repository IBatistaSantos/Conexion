import { Module } from '@nestjs/common';
import { CompanyController } from './controller/create-company';
import { PrismaCompanyRepository } from './providers/repos/prisma/company.repository';
import { CreateCompanyService } from './services/create-company.service';
import { DetailsCompanyService } from './services/details-company.service';

@Module({
  imports: [],
  providers: [
    DetailsCompanyService,
    CreateCompanyService,
    {
      provide: 'CompanyRepository',
      useClass: PrismaCompanyRepository,
    },
  ],
  controllers: [CompanyController],
  exports: [DetailsCompanyService, CreateCompanyService],
})
export class CompanyModule {}
