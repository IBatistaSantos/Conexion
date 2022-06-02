import { Test, TestingModule } from '@nestjs/testing';
import { DetailsPipelineService } from '../../../../src/modules/pipeline/services/details-pipeline.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PipelineRepository } from '../../../../src/modules/pipeline/repository/pipeline.repository';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('DetailsPipelineService', () => {
  let service: DetailsPipelineService;

  let pipelineRepository: MockProxy<PipelineRepository>;

  const pipeline = {
    id: 'any_id',
    name: 'any_name',
    companyId: 'any_companyId',
    description: 'any_description',
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  };

  beforeAll(() => {
    pipelineRepository = mock();

    pipelineRepository.findByName.mockResolvedValue(null);
    pipelineRepository.create.mockResolvedValue(pipeline);
    pipelineRepository.findById.mockResolvedValue(pipeline);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailsPipelineService,
        { provide: 'PipelineRepository', useValue: pipelineRepository },
      ],
    }).compile();

    service = module.get<DetailsPipelineService>(DetailsPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findById with correct parameters', async () => {
    await service.execute({
      companyId: 'any_companyId',
      pipelineId: 'any_pipelineId',
    });

    expect(pipelineRepository.findById).toBeCalledWith('any_pipelineId');
    expect(pipelineRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if pipeline not found', async () => {
    pipelineRepository.findById.mockResolvedValueOnce(null);

    const data = {
      companyId: 'any_companyId',
      pipelineId: 'any_pipelineId',
    };

    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new NotFoundException(`Pipeline with id ${data.pipelineId} not found`),
    );
  });

  it('should throw an error if pipeline not for the company', async () => {
    const promise = service.execute({
      companyId: 'any_other_companyId',
      pipelineId: 'any_pipelineId',
    });

    await expect(promise).rejects.toThrow(
      new UnauthorizedException('Pipeline does not belong to user'),
    );
  });

  it('should return pipeline on success', async () => {
    const result = await service.execute({
      companyId: 'any_companyId',
      pipelineId: 'any_pipelineId',
    });

    expect(result).toEqual(pipeline);
  });
});
