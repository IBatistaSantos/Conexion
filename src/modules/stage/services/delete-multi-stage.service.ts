import { Inject, Injectable } from '@nestjs/common';
import { DetailsPipelineService } from '../../../modules/pipeline/services/details-pipeline.service';

import { StageRepository } from '../repository/stage.repository';

type DeleteBulkStageRequest = {
  ids: string;
  companyId: string;
};

@Injectable()
export class DeleteBulkStageService {
  constructor(
    @Inject('StageRepository')
    private readonly stageRepository: StageRepository,
    private readonly detailsPipelineService: DetailsPipelineService,
  ) {}

  async execute(params: DeleteBulkStageRequest) {
    const { ids, companyId } = params;

    const stagesToDelete = ids.split(',');

    stagesToDelete.forEach(async (id) => {
      const stage = await this.stageRepository.findById(id);

      if (stage) {
        await this.detailsPipelineService.execute({
          pipelineId: stage.pipelineId,
          companyId,
        });
        await this.stageRepository.delete(id);
      }
    });
  }
}
