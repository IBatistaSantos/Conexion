export interface ProductRepository {
  findByCode(params: FindByCodeAndCompanyId): Promise<any>;
  create(params: CreateProductParams): Promise<any>;
}

export type FindByCodeAndCompanyId = {
  code: string;
  companyId: string;
};

export type CreateProductParams = {
  name: string;
  code: string;
  description?: string;
  category: string;
  companyId: string;
};
