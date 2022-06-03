import { Deal } from '../entities/deal';

export interface DealRepository {
  create(params: CreateDealParams): Promise<Deal>;
  hasCompany(params: HasCompanyParams): Promise<boolean>;
  hasStageAvailable(params: HasStageAvailableParams): Promise<boolean>;
  findDealByPipelineId(
    params: FindDealsByPipelineParams,
  ): Promise<FindDealsByPipelineResult[]>;
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
  productId?: string;
};

export type HasStageAvailableParams = {
  stageId: string;
  companyId: string;
};

export type FindDealsByPipelineResult = {
  id: string;
  title: string;
  stageId: string;
  creator_id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  stage: {
    id: string;
    name: string;
    pipelineId: string;
    createdAt: Date;
    updatedAt: Date;
    pipeline: {
      id: string;
      name: string;
    };
  };
  user: {
    name: string;
    id: string;
  };
  creator: {
    name: string;
    id: string;
  };
};

export type FindDealsByPipelineParams = {
  pipelineId: string;
  companyId: string;
};
