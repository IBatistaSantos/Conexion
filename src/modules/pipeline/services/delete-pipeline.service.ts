import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class DeletePipelineService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(pipelineId: string) {
    const pipelineAlreadyExists = await this.prismaService.pipeline.findUnique({
      where: { id: pipelineId },
    });

    if (!pipelineAlreadyExists) {
      throw new NotFoundException(`Pipeline with id ${pipelineId} not found`);
    }

    await this.prismaService.pipeline.update({
      where: { id: pipelineId },
      data: {
        active: false,
      },
    });
  }
}
