import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { DealRepository } from '../../../../src/modules/deal/repository/deal.repository';
import { ListDealPipelineService } from '../../../../src/modules/deal/services/list-deal-pipeline.service';

describe('ListDealPipelineService', () => {
  let service: ListDealPipelineService;

  let dealRepository: MockProxy<DealRepository>;

  const deal = {
    id: 'any_id',
    title: 'any_title',
    stageId: 'any_stage_id',
    creator_id: 'any_creator_id',
    userId: 'any_user_id',
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
    stage: {
      id: 'any_stage_id',
      name: 'any_name',
      pipelineId: 'any_pipeline_id',
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
      pipeline: {
        id: 'any_pipeline_id',
        name: 'any_pipeline_name',
      },
    },
    user: {
      name: 'any_user_name',
      id: 'any_user_id',
    },
    creator: {
      name: 'any_creator_name',
      id: 'any_creator_id',
    },
  };

  beforeAll(() => {
    dealRepository = mock();

    dealRepository.findDealByPipelineId.mockResolvedValue([deal]);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListDealPipelineService,
        { provide: 'DealRepository', useValue: dealRepository },
      ],
    }).compile();

    service = module.get<ListDealPipelineService>(ListDealPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findDealByPipelineId with correct parameters', async () => {
    await service.execute({
      pipelineId: 'any_pipeline_id',
      companyId: 'any_company_id',
    });

    expect(dealRepository.findDealByPipelineId).toHaveBeenCalledWith({
      pipelineId: 'any_pipeline_id',
      companyId: 'any_company_id',
    });
    expect(dealRepository.findDealByPipelineId).toHaveBeenCalledTimes(1);
  });

  it('should returns an deals  on success', async () => {
    const result = await service.execute({
      pipelineId: 'any_pipeline_id',
      companyId: 'any_company_id',
    });

    expect(result).toEqual([
      {
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
      },
    ]);
  });
});
