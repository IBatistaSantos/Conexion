import { BadRequestException, Injectable } from '@nestjs/common';
import { DetailsPipelineService } from 'src/modules/pipeline/services/details-pipeline.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateStageDto } from '../dtos/create-stage.dto';

@Injectable()
export class CreateStageService {
  constructor(
    private readonly detailsPipelineService: DetailsPipelineService,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(params: CreateStageDto) {
    const { pipelineId, name } = params;

    const pipeline = await this.detailsPipelineService.execute(pipelineId);

    const stageAlreadyExists = await this.prismaService.stage.findFirst({
      where: {
        name: name,
        AND: {
          pipelineId,
        },
      },
    });

    if (stageAlreadyExists) {
      throw new BadRequestException(
        `Stage with name ${name} already exists from pipeline ${pipeline.name}`,
      );
    }

    return this.prismaService.stage.create({
      data: {
        name: name,
        pipelineId,
      },
    });
  }
}
