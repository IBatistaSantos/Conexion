import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DetailsPipelineService } from '../../../modules/pipeline/services/details-pipeline.service';
import { CreateStageDto } from '../dtos/create-stage.dto';
import { StageRepository } from '../repository/stage.repository';

type CreateStageParams = CreateStageDto & {
  companyId: string;
};
@Injectable()
export class CreateStageService {
  constructor(
    @Inject('StageRepository')
    private readonly stageRepository: StageRepository,
    private readonly detailsPipelineService: DetailsPipelineService,
  ) {}
  async execute(params: CreateStageParams) {
    const { pipelineId, name, companyId } = params;

    const pipeline = await this.detailsPipelineService.execute({
      pipelineId,
      companyId,
    });

    if (!pipeline) {
      throw new BadRequestException('Pipeline does not exist');
    }

    const stageAlreadyExists = await this.stageRepository.findByName({
      name,
      pipelineId,
    });

    if (stageAlreadyExists) {
      throw new BadRequestException(
        `Stage with name ${name} already exists from pipeline ${pipeline.name}`,
      );
    }

    return this.stageRepository.create({
      name,
      pipelineId,
    });
  }
}
