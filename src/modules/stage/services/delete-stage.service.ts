import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DetailsPipelineService } from 'src/modules/pipeline/services/details-pipeline.service';

import { StageRepository } from '../repository/stage.repository';

type DeleteStageServiceRequest = {
  stageId: string;
  userId: string;
};

@Injectable()
export class DeleteStageService {
  constructor(
    @Inject('StageRepository')
    private readonly stageRepository: StageRepository,
    private readonly detailsPipelineService: DetailsPipelineService,
  ) {}
  async execute(params: DeleteStageServiceRequest) {
    const { stageId, userId } = params;

    const stageAlreadyExists = await this.stageRepository.findById(stageId);

    if (!stageAlreadyExists) {
      throw new NotFoundException(`Stage with id ${stageId} not found`);
    }

    await this.detailsPipelineService.execute({
      pipelineId: stageAlreadyExists.pipelineId,
      userId,
    });

    await this.stageRepository.delete(stageId);
  }
}
