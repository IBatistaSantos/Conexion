import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBulkStageService } from '../../../../src/modules/stage/services/delete-multi-stage.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { StageRepository } from '../../../../src/modules/stage/repository/stage.repository';
import { DetailsPipelineService } from '../../../../src/modules/pipeline/services/details-pipeline.service';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('DeleteBulkStageService', () => {
  let service: DeleteBulkStageService;

  let stageRepository: MockProxy<StageRepository>;
  let detailsPipelineService: MockProxy<DetailsPipelineService>;

  const stage = {
    id: 'any_id',
    name: 'any_name',
    pipelineId: 'any_pipelineId',
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  };

  const pipeline = {
    id: 'any_id',
    name: 'any_name',
    companyId: 'any_companyId',
    description: 'any_description',
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  };

  beforeAll(() => {
    stageRepository = mock();
    detailsPipelineService = mock();

    stageRepository.findById.mockResolvedValue(stage);
    detailsPipelineService.execute.mockResolvedValue(pipeline);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBulkStageService,
        { provide: 'StageRepository', useValue: stageRepository },
        { provide: DetailsPipelineService, useValue: detailsPipelineService },
      ],
    }).compile();

    service = module.get<DeleteBulkStageService>(DeleteBulkStageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findById with correct parameters', async () => {
    await service.execute({
      companyId: 'any_companyId',
      ids: 'any_id,other_id',
    });

    expect(stageRepository.findById).toBeCalledWith('any_id');
    expect(stageRepository.findById).toBeCalledWith('other_id');
    expect(stageRepository.findById).toHaveBeenCalledTimes(2);
  });
});
