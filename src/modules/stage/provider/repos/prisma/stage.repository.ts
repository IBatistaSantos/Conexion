import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Stage } from 'src/modules/stage/entities/stage';
import {
  CreateStageParams,
  FindByNameParams,
  StageRepository,
  UpdateStageParams,
} from 'src/modules/stage/repository/stage.repository';

@Injectable()
export class PrismaStageRepository implements StageRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async deleteBulk(stageIds: string[]): Promise<void> {
    await this.prismaService.stage.deleteMany({
      where: {
        id: {
          in: stageIds,
        },
      },
    });
  }
  async delete(stageId: string): Promise<void> {
    await this.prismaService.stage.delete({
      where: {
        id: stageId,
      },
    });
  }
  update(params: UpdateStageParams): Promise<Stage> {
    return this.prismaService.stage.update({
      where: {
        id: params.stageId,
      },
      data: {
        name: params.name || undefined,
      },
    });
  }
  findById(id: string): Promise<Stage> {
    return this.prismaService.stage.findUnique({
      where: {
        id,
      },
      include: {
        pipeline: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }
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
