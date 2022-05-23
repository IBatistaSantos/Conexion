import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Stage } from 'src/modules/stage/entities/stage';
import {
  CreateStageParams,
  FindByNameParams,
  StageRepository,
} from 'src/modules/stage/repository/stage.repository';

@Injectable()
export class PrismaStageRepository implements StageRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(params: CreateStageParams): Promise<Stage> {
    return this.prismaService.stage.create({
      data: {
        name: params.name,
        pipelineId: params.pipelineId,
      },
    });
  }
  findByName(params: FindByNameParams): Promise<Stage> {
    const { name, pipelineId } = params;
    return this.prismaService.stage.findFirst({
      where: {
        name,
        AND: {
          pipelineId,
        },
      },
    });
  }
}
