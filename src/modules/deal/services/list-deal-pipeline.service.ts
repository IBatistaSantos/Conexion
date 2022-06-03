import { Inject, Injectable } from '@nestjs/common';
import { DealRepository } from '../repository/deal.repository';

type ListAllDealByPipelineServiceParams = {
  companyId: string;
  pipelineId: string;
};
@Injectable()
export class ListDealPipelineService {
  constructor(
    @Inject('DealRepository')
    private readonly dealRepository: DealRepository,
  ) {}

  async execute(params: ListAllDealByPipelineServiceParams): Promise<any> {
    const { pipelineId, companyId } = params;
    const deals = await this.dealRepository.findDealByPipelineId({
      pipelineId,
      companyId,
    });

    const dealFormatted = deals.map((deal) => {
      return {
        id: deal.id,
        title: deal.title,
        createdAt: deal.createdAt,
        pipeline: {
          id: deal.stage.pipeline.id,
          name: deal.stage.pipeline.name,
          stage: {
            id: deal.stage.id,
            name: deal.stage.name,
          },
        },
        creator: {
          id: deal.creator.id,
          name: deal.creator.name,
        },
        user: {
          id: deal.user.id,
          name: deal.user.name,
        },
      };
    });

    return dealFormatted;
  }
}
