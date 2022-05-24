import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PipelineRepository } from '../repository/pipeline.repository';

type DetailsPipelineRequest = {
  pipelineId: string;
  companyId: string;
};

@Injectable()
export class DetailsPipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}

  async execute(params: DetailsPipelineRequest) {
    const { pipelineId, companyId } = params;

    const pipeline = await this.pipelineRepository.findById(pipelineId);

    if (!pipeline) {
      throw new NotFoundException(`Pipeline with id ${pipelineId} not found`);
    }

    if (pipeline.companyId !== companyId) {
      throw new UnauthorizedException('Pipeline does not belong to user');
    }

    return pipeline;
  }
}
