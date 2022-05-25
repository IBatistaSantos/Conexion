export interface PersonRepository {
  findById(personId: string): Promise<any>;
  create(params: CreatePersonParams): Promise<any>;
  update(params: UpdatePersonParams): Promise<any>;
  delete(params: DeletePersonParams): Promise<any>;
  hasCompanyCreator(params: HasCompanyCreatorParams): Promise<boolean>;
}

export type CreatePersonParams = {
  name: string;
  email: string;
  ownerId?: string;
  companyId: string;
};

export type HasCompanyCreatorParams = {
  companyId: string;
  creatorId: string;
};

export type DeletePersonParams = {
  personId: string;
  companyId: string;
};

export type UpdatePersonParams = {
  personId: string;
  name: string;
  email: string;
  ownerId?: string;
};
