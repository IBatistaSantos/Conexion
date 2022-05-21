import { Company } from '../entities/company.entity';

export interface CompanyRepository {
  findById(id: string): Promise<Company>;
  create(params: CreateCompany): Promise<Company>;
}

export type CreateCompany = {
  name: string;
  ownerId: string;
};
