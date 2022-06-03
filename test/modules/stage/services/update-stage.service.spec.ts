import { Test, TestingModule } from '@nestjs/testing';
import { UpdateStageService } from '../../../../src/modules/stage/services/update-stage.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { StageRepository } from '../../../../src/modules/stage/repository/stage.repository';
import { DetailsPipelineService } from '../../../../src/modules/pipeline/services/details-pipeline.service';
import { NotFoundException } from '@nestjs/common';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('UpdateStageService', () => {
  let service: UpdateStageService;

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
    stageRepository.update.mockResolvedValue(stage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStageService,
        { provide: 'StageRepository', useValue: stageRepository },
        { provide: DetailsPipelineService, useValue: detailsPipelineService },
      ],
    }).compile();

    service = module.get<UpdateStageService>(UpdateStageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call DetailsPipelineService with correct parameters', async () => {
    const spyOn = jest.spyOn(detailsPipelineService, 'execute');
    await service.execute({
      companyId: 'any_companyId',
      stageId: 'any_stageId',
      updateStage: {
        name: 'any_name',
      },
    });

    expect(spyOn).toBeCalledWith({
      companyId: 'any_companyId',
      pipelineId: 'any_pipelineId',
    });
    expect(spyOn).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if pipeline not found', async () => {
    detailsPipelineService.execute.mockResolvedValueOnce(null);

    const promise = service.execute({
      companyId: 'any_companyId',
      stageId: 'any_stageId',
      updateStage: {
        name: 'any_name',
      },
    });

    await expect(promise).rejects.toThrow(
      new NotFoundException('Pipeline does not exist'),
    );
  });

  it('should throw an error if stage not found', async () => {
    stageRepository.findById.mockResolvedValueOnce(null);
    const data = {
      companyId: 'any_companyId',
      stageId: 'any_stageId',
      updateStage: {
        name: 'any_name',
      },
    };
    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new NotFoundException(`Stage with id ${data.stageId} not found`),
    );
  });

  it('should call update with correct parameters', async () => {
    const data = {
      companyId: 'any_companyId',
      stageId: 'any_stageId',
      updateStage: {
        name: 'any_name',
      },
    };
    await service.execute(data);

    expect(stageRepository.update).toBeCalledWith({
      stageId: data.stageId,
      name: data.updateStage.name,
    });

    expect(stageRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should return updated stage', async () => {
    const data = {
      companyId: 'any_companyId',
      stageId: 'any_stageId',
      updateStage: {
        name: 'any_name',
      },
    };
    const result = await service.execute(data);

    expect(result).toEqual(stage);
  });
});
