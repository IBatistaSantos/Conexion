import { Inject, Injectable } from '@nestjs/common';
import { PipelineRepository } from '../repository/pipeline.repository';

@Injectable()
export class ListAllPipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}

  async execute(companyId: string) {
    return this.pipelineRepository.findAll(companyId);
  }
}
