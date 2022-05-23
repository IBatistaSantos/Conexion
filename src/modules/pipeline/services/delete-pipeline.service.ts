import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PipelineRepository } from '../repository/pipeline.repository';

type DeletePipelineParams = {
  pipelineId: string;
  userId: string;
};
@Injectable()
export class DeletePipelineService {
  constructor(
    @Inject('PipelineRepository')
    private readonly pipelineRepository: PipelineRepository,
  ) {}
  async execute(params: DeletePipelineParams) {
    const { pipelineId, userId } = params;
    const pipeline = await this.pipelineRepository.findById(pipelineId);

    if (!pipeline) {
      throw new NotFoundException('Pipeline does not exist');
    }

    const companyId = await this.pipelineRepository.findCompanyByUserId(userId);

    if (!companyId) {
      throw new NotFoundException('User does not have a company');
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
