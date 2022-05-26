export interface VtexRepositorys {
  findByCompanyId(companyId: string): Promise<any>;
  create(params: CreateVtexAuthenticationParams): Promise<any>;
}

export type CreateVtexAuthenticationParams = {
  companyId: string;
  appKey: string;
  appToken: string;
  integrationOrder: boolean;
  integrationProduct: boolean;
};
