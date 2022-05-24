import { Injectable } from '@nestjs/common';
import {
  CreatePipelineParams,
  DeletePipelineParams,
  FindByNameParams,
  PipelineRepository,
  UpdatePipelineParams,
} from '../../../repository/pipeline.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Pipeline } from './../../../entities/pipeline';

@Injectable()
export class PrismaPipelineRepository implements PipelineRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findDealByPipelineId(pipelineId: string): Promise<any> {
    return this.prismaService.deal.findMany({
      where: {
        stage: {
          pipelineId,
        },
      },
      include: {
        stage: {
          include: {
            pipeline: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        creator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }
  async update(params: UpdatePipelineParams): Promise<Pipeline> {
    return this.prismaService.pipeline.update({
      where: {
        id: params.pipelineId,
      },
      data: {
        name: params.name || undefined,
        description: params.description || undefined,
      },
    });
  }
  async delete(params: DeletePipelineParams): Promise<void> {
    await this.prismaService.pipeline.update({
      where: {
        id: params.pipelineId,
      },
      data: {
        active: false,
      },
    });
  }
  async findById(pipelineId: string): Promise<Pipeline> {
    return this.prismaService.pipeline.findUnique({
      where: {
        id: pipelineId,
      },
      include: {
        stages: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async findCompanyByUserId(userId: string): Promise<string | undefined> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          owner: true,
          employees: true,
        },
      });

      return user.owner ? user.owner.id : user.employees.companyId;
    } catch {
      return undefined;
    }
  }
  async findAll(companyId: string): Promise<Pipeline[]> {
    return this.prismaService.pipeline.findMany({
      where: {
        companyId,
        AND: {
          active: true,
        },
      },
    });
  }
  async findByName(params: FindByNameParams): Promise<Pipeline> {
    return this.prismaService.pipeline.findFirst({
      where: {
        name: params.name,
        AND: {
          companyId: params.companyId,
        },
      },
    });
  }

  async create(params: CreatePipelineParams): Promise<Pipeline> {
    return this.prismaService.pipeline.create({
      data: params,
    });
  }
}
