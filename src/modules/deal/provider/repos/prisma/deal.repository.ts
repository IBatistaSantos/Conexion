import { Injectable } from '@nestjs/common';
import {
  CreateDealParams,
  DealRepository,
  HasCompanyParams,
  HasStageAvailableParams,
} from 'src/modules/deal/repository/deal.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PrismaDealRepository implements DealRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async hasStageAvailable(params: HasStageAvailableParams): Promise<boolean> {
    const { companyId, stageId } = params;

    const stageAvailable = await this.prismaService.stage.findFirst({
      where: {
        id: stageId,
      },
      include: {
        pipeline: true,
      },
    });

    if (!stageAvailable || stageAvailable.pipeline.companyId !== companyId) {
      return false;
    }

    return true;
  }

  async create(params: CreateDealParams): Promise<any> {
    const { title, stageId, userId, creator_id, personId } = params;
    return this.prismaService.deal.create({
      data: {
        title,
        stageId,
        creator_id,
        userId,
        personId: personId || undefined,
      },
      include: {
        stage: {
          include: {
            pipeline: {
              select: {
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
        person: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async hasCompany(params: HasCompanyParams): Promise<boolean> {
    const { companyId, userId } = params;
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        owner: true,
        employees: true,
      },
    });

    if (!user) {
      return false;
    }

    const companyIdUser = user.owner ? user.owner.id : user.employees.companyId;

    if (companyIdUser !== companyId) {
      return false;
    }

    return true;
  }
}
