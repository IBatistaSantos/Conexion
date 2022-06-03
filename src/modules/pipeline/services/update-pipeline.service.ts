import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePipelineDto } from '../dtos/update-pipeline.dto';
import { PipelineRepository } from '../repository/pipeline.repository';

type UpdatePipelineRequest = {
  pipelineId: string;
  userId: string;
  updatePipeline: UpdatePipelineDto;
};

@Injectable()
export class UpdatePipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}
  async execute(updatePipelineDto: UpdatePipelineRequest) {
    const { pipelineId, updatePipeline: data, userId } = updatePipelineDto;

    const { name } = data;

    const pipeline = await this.pipelineRepository.findById(pipelineId);

    if (!pipeline) {
      throw new NotFoundException('Pipeline does not exist');
    }

    const companyId = await this.pipelineRepository.findCompanyByUserId(userId);

    if (!companyId) {
      throw new NotFoundException('User does not have a company');
    }

    if (pipeline.companyId !== companyId) {
      throw new BadRequestException(
        'User does not have permission to update this pipeline',
      );
    }

    if (name) {
      const pipelineAlreadyExists = await this.pipelineRepository.findByName({
        name,
        companyId,
      });

      if (pipelineAlreadyExists) {
        throw new BadRequestException(
          `Pipeline with name ${name} already exists`,
        );
      }
    }

    return this.pipelineRepository.update({
      pipelineId,
      ...data,
    });
  }
}
