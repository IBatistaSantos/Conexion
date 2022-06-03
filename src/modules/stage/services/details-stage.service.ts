import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DetailsPipelineService } from '../../../modules/pipeline/services/details-pipeline.service';
import { StageRepository } from '../repository/stage.repository';

type Request = {
  stageId: string;
  companyId: string;
};

@Injectable()
export class DetailsStageService {
  constructor(
    @Inject('StageRepository')
    private readonly stageRepository: StageRepository,
    private readonly detailsPipelineService: DetailsPipelineService,
  ) {}

  async execute(params: Request) {
    const { stageId, companyId } = params;

    const stageDetails = await this.stageRepository.findById(stageId);

    if (!stageDetails) {
      throw new NotFoundException(`Stage with id ${stageId} not found`);
    }

    await this.detailsPipelineService.execute({
      pipelineId: stageDetails.pipelineId,
      companyId,
    });

    return stageDetails;
  }
}
