import { Company } from '../entities/company.entity';

export interface CompanyRepository {
  create(params: CreateCompany): Promise<Company>;
  findByName(name: string): Promise<Company>;
}

type CreateCompany = Omit<Company, 'id'>;
