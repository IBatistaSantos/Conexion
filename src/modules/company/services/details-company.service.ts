import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '../repository/company.repository';

@Injectable()
export class DetailsCompanyService {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(companyId: string) {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new NotFoundException(`Company with id ${companyId} not found`);
    }

    return this.companyRepository.findById(companyId);
  }
}
