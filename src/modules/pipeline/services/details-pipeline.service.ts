import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PipelineRepository } from '../repository/pipeline.repository';

type DetailsPipelineRequest = {
  pipelineId: string;
  userId: string;
};

@Injectable()
export class DetailsPipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}

  async execute(params: DetailsPipelineRequest) {
    const { pipelineId, userId } = params;
    const companyId = await this.pipelineRepository.findCompanyByUserId(userId);

    if (!companyId) {
      throw new NotFoundException('User does not have a company');
    }

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
