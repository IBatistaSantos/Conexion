import { Module } from '@nestjs/common';
import { PrismaCompanyRepository } from './providers/repos/prisma/company.repository';
import { DetailsCompanyService } from './services/details-company.service';

@Module({
  imports: [],
  providers: [
    DetailsCompanyService,
    {
      provide: 'CompanyRepository',
      useClass: PrismaCompanyRepository,
    },
  ],
  controllers: [],
  exports: [DetailsCompanyService],
})
export class CompanyModule {}
