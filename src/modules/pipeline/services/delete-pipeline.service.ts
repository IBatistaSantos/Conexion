import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PipelineRepository } from '../repository/pipeline.repository';

type DeletePipelineParams = {
  pipelineId: string;
  companyId: string;
};
@Injectable()
export class DeletePipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}
  async execute(params: DeletePipelineParams) {
    const { pipelineId, companyId } = params;
    const pipeline = await this.pipelineRepository.findById(pipelineId);

    if (!pipeline) {
      throw new NotFoundException('Pipeline does not exist');
    }

    if (pipeline.companyId !== companyId) {
      throw new UnauthorizedException(
        'User does not have permission to delete this pipeline',
      );
    }

    await this.pipelineRepository.delete({
      pipelineId,
    });
  }
}
