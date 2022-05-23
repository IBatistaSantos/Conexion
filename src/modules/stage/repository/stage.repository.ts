import { Stage } from '../entities/stage';

export interface StageRepository {
  findById(id: string): Promise<Stage>;
  findByName(params: FindByNameParams): Promise<Stage>;
  create(params: CreateStageParams): Promise<Stage>;
  update(params: UpdateStageParams): Promise<Stage>;
}

export type FindByNameParams = {
  name: string;
  pipelineId: string;
};

export type CreateStageParams = {
  name: string;
  pipelineId: string;
};

export type UpdateStageParams = {
  name?: string;
  stageId: string;
};
