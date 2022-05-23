import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PipelineRepository } from '../repository/pipeline.repository';

@Injectable()
export class ListAllPipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}

  async execute(userId: string) {
    const companyId = await this.pipelineRepository.findCompanyByUserId(userId);

    if (!companyId) {
      throw new BadRequestException('User does not have a company');
    }

    return this.pipelineRepository.findAll(companyId);
  }
}
