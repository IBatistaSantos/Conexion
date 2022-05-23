import { Pipeline } from '../entities/pipeline';

export interface PipelineRepository {
  findAll(companyId: string): Promise<Pipeline[]>;
  findByName(params: FindByNameParams): Promise<Pipeline | undefined>;
  findById(pipelineId: string): Promise<Pipeline | undefined>;
  findCompanyByUserId(userId: string): Promise<string>;
  create(params: CreatePipelineParams): Promise<Pipeline>;
  delete(params: DeletePipelineParams): Promise<void>;
}

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
