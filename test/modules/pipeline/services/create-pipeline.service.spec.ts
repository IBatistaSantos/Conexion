import { Test, TestingModule } from '@nestjs/testing';
import { CreatePipelineService } from '../../../../src/modules/pipeline/services/create-pipeline.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { PipelineRepository } from '../../../../src/modules/pipeline/repository/pipeline.repository';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('CreatPipelineService', () => {
  let service: CreatePipelineService;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePipelineService,
        { provide: 'PipelineRepository', useValue: pipelineRepository },
      ],
    }).compile();

    service = module.get<CreatePipelineService>(CreatePipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findByName with correct parameters', async () => {
    await service.execute({
      companyId: 'any companyId',
      name: 'any name',
      description: 'any description',
    });

    expect(pipelineRepository.findByName).toBeCalledWith({
      name: 'any name',
      companyId: 'any companyId',
    });
    expect(pipelineRepository.findByName).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if pipeline name already exists', async () => {
    pipelineRepository.findByName.mockResolvedValueOnce(pipeline);
    const data = {
      companyId: 'any_companyId',
      description: 'any_description',
      name: 'any_name',
    };
    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new BadRequestException(
        `Pipeline with name ${data.name} already exists `,
      ),
    );
  });

  it('should call create with correct parameters', async () => {
    await service.execute({
      companyId: 'any_companyId',
      description: 'any_description',
      name: 'any_name',
    });

    expect(pipelineRepository.create).toBeCalledWith({
      companyId: 'any_companyId',
      description: 'any_description',
      name: 'any_name',
    });

    expect(pipelineRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should returns an user on success', async () => {
    const result = await service.execute({
      companyId: 'any_companyId',
      description: 'any_description',
      name: 'any_name',
    });

    expect(result).toEqual(pipeline);
  });
});
