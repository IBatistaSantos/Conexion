import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CreatePipelineDto } from '../dtos/create-pipeline.dto';
import { PipelineRepository } from '../repository/pipeline.repository';

@Injectable()
export class CreatePipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}
  async execute(createPipelineDto: CreatePipelineDto) {
    const { name, companyId } = createPipelineDto;

    const pipelineAlreadyExists = await this.pipelineRepository.findByName({
      name,
      companyId,
    });

    if (pipelineAlreadyExists) {
      throw new BadRequestException(
        `Pipeline with name ${name} already exists `,
      );
    }

    return this.pipelineRepository.create(createPipelineDto);
  }
}
