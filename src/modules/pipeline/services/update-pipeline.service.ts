import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdatePipelineDto } from '../dtos/update-pipeline.dto';

type UpdatePipelineRequest = {
  pipelineId: string;
  updatePipeline: UpdatePipelineDto;
};

@Injectable()
export class UpdatePipelineService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(updatePipelineDto: UpdatePipelineRequest) {
    const { pipelineId, updatePipeline } = updatePipelineDto;
    const { name } = updatePipeline;

    if (name) {
      const pipelineAlreadyExists =
        await this.prismaService.pipeline.findUnique({
          where: { name },
        });

      if (pipelineAlreadyExists && pipelineAlreadyExists.id !== pipelineId) {
        throw new BadRequestException(
          `Pipeline with name ${name} already exists`,
        );
      }
    }

    return this.prismaService.pipeline.update({
      where: { id: pipelineId },
      data: updatePipeline,
    });
  }
}
