import { Deal } from '../entities/deal';

export interface DealRepository {
  create(params: CreateDealParams): Promise<Deal>;
  hasCompany(params: HasCompanyParams): Promise<boolean>;
  hasStageAvailable(params: HasStageAvailableParams): Promise<boolean>;
}

export type HasCompanyParams = {
  companyId: string;
  userId: string;
};

export type CreateDealParams = {
  title: string;
  stageId: string;
  creator_id: string;
  userId: string;
  personId?: string;
};

export type HasStageAvailableParams = {
  stageId: string;
  companyId: string;
};
