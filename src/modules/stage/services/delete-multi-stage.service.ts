import { Inject, Injectable } from '@nestjs/common';
import { DetailsPipelineService } from 'src/modules/pipeline/services/details-pipeline.service';

import { StageRepository } from '../repository/stage.repository';

type DeleteBulkStageRequest = {
  ids: string;
  userId: string;
};

@Injectable()
export class DeleteBulkStageService {
  constructor(
    @Inject('StageRepository')
    private readonly stageRepository: StageRepository,

    private readonly detailsPipelineService: DetailsPipelineService,
  ) {}

  async execute(params: DeleteBulkStageRequest) {
    const { ids, userId } = params;

    const stagesToDelete = ids.split(',');

    stagesToDelete.forEach(async (id) => {
      const stage = await this.stageRepository.findById(id);

      if (stage) {
        await this.detailsPipelineService.execute({
          pipelineId: stage.pipelineId,
          userId,
        });
        await this.stageRepository.delete(id);
      }
    });
  }
}
