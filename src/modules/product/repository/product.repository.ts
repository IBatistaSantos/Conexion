export interface ProductRepository {
  findById(productId: string): Promise<any>;
  findAll(companyId: string): Promise<any>;
  findByCode(params: FindByCodeAndCompanyId): Promise<any>;
  create(params: CreateProductParams): Promise<any>;
  findDealByProductId(params: FindDealByProductId): Promise<any>;
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

export type FindDealByProductId = {
  productId: string;
  companyId: string;
};
