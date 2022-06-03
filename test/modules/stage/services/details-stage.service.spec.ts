import { Test, TestingModule } from '@nestjs/testing';
import { DetailsStageService } from '../../../../src/modules/stage/services/details-stage.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { StageRepository } from '../../../../src/modules/stage/repository/stage.repository';
import { DetailsPipelineService } from '../../../../src/modules/pipeline/services/details-pipeline.service';
import { NotFoundException } from '@nestjs/common';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('DetailsStageService', () => {
  let service: DetailsStageService;

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
    stageRepository.create.mockResolvedValue(stage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailsStageService,
        { provide: 'StageRepository', useValue: stageRepository },
        { provide: DetailsPipelineService, useValue: detailsPipelineService },
      ],
    }).compile();

    service = module.get<DetailsStageService>(DetailsStageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findById with correct parameters', async () => {
    await service.execute({
      stageId: 'any_stageId',
      companyId: 'any_companyId',
    });

    expect(stageRepository.findById).toBeCalledWith('any_stageId');
    expect(stageRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if stage not found', async () => {
    stageRepository.findById.mockResolvedValueOnce(null);

    const data = {
      stageId: 'any_stageId',
      companyId: 'any_companyId',
    };

    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new NotFoundException(`Stage with id ${data.stageId} not found`),
    );
  });

  it('should call DetailsPipelineService with correct parameters', async () => {
    const spyOn = jest.spyOn(detailsPipelineService, 'execute');
    await service.execute({
      stageId: 'any_stageId',
      companyId: 'any_companyId',
    });

    expect(spyOn).toBeCalledWith({
      companyId: 'any_companyId',
      pipelineId: 'any_pipelineId',
    });
    expect(spyOn).toHaveBeenCalledTimes(1);
  });

  it('should returns an stage on success', async () => {
    const result = await service.execute({
      stageId: 'any_stageId',
      companyId: 'any_companyId',
    });

    expect(result).toEqual(stage);
  });
});
