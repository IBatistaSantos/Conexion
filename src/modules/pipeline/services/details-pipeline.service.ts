import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class DetailsPipelineService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(pipelineId: string) {
    const pipeline = await this.prismaService.pipeline.findUnique({
      where: { id: pipelineId },
      include: {
        stages: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!pipeline) {
      throw new NotFoundException(`Pipeline with id ${pipelineId} not found`);
    }

    return pipeline;
  }
}
