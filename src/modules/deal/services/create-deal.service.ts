import { Inject, Injectable } from '@nestjs/common';
import { DetailsPersonService } from 'src/modules/person/services/detail-person.service';
import { DealRepository } from '../repository/deal.repository';

type CreateCreateDealServiceParams = {
  title: string;
  stageId: string;
  creatorId: string;
  userId?: string;
  companyId: string;
  personId?: string;
};

@Injectable()
export class CreateDealService {
  constructor(
    @Inject('DealRepository')
    private readonly dealRepository: DealRepository,

    private readonly detailsPersonService: DetailsPersonService,
  ) {}

  async execute(params: CreateCreateDealServiceParams): Promise<any> {
    const { title, stageId, creatorId, userId, companyId, personId } = params;

    if (userId) {
      const hasCompanyUser = await this.dealRepository.hasCompany({
        companyId,
        userId,
      });

      if (!hasCompanyUser) {
        throw new Error('User not in company');
      }
    }

    if (personId) {
      const person = await this.detailsPersonService.execute({
        personId,
        companyId,
      });

      if (person.companyId !== companyId) {
        throw new Error('Person not in company');
      }
    }

    const stageAvailable = await this.dealRepository.hasStageAvailable({
      companyId,
      stageId,
    });

    if (!stageAvailable) {
      throw new Error('Stage not available');
    }

    const deal = await this.dealRepository.create({
      creator_id: creatorId,
      stageId,
      title,
      userId: userId ?? creatorId,
      personId,
    });

    return {
      id: deal.id,
      title: deal.title,
      stage: {
        id: deal.stage.id,
        name: deal.stage.name,
      },
      ...(userId && {
        user: {
          id: deal.user.id,
          name: deal.user.name,
        },
      }),
      ...(personId && {
        person: {
          id: deal.person.id,
          name: deal.person.name,
        },
      }),
    };
  }
}
