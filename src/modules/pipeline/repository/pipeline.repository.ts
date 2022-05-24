import { Pipeline } from '../entities/pipeline';

export interface PipelineRepository {
  findAll(companyId: string): Promise<Pipeline[]>;
  findByName(params: FindByNameParams): Promise<Pipeline | undefined>;
  findById(pipelineId: string): Promise<Pipeline | undefined>;
  findCompanyByUserId(userId: string): Promise<string>;
  findDealByPipelineId(
    params: FindDealsByPipelineParams,
  ): Promise<FindDealsByPipelineResult[]>;
  create(params: CreatePipelineParams): Promise<Pipeline>;
  update(params: UpdatePipelineParams): Promise<Pipeline>;
  delete(params: DeletePipelineParams): Promise<void>;
}

export type UpdatePipelineParams = {
  pipelineId: string;
  name?: string;
  description?: string;
};

export type CreatePipelineParams = Omit<
  Pipeline,
  'id' | 'createdAt' | 'updatedAt'
>;

export type FindByNameParams = {
  name: string;
  companyId: string;
};

export type DeletePipelineParams = {
  pipelineId: string;
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
