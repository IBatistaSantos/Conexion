import { Company } from '../entities/company.entity';

export interface CompanyRepository {
  findById(id: string): Promise<Company>;
}
