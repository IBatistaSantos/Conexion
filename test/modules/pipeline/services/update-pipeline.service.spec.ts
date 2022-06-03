import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePipelineService } from '../../../../src/modules/pipeline/services/update-pipeline.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PipelineRepository } from '../../../../src/modules/pipeline/repository/pipeline.repository';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('UpdatePipelineService', () => {
  let service: UpdatePipelineService;

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

    pipelineRepository.findById.mockResolvedValue(pipeline);
    pipelineRepository.findCompanyByUserId.mockResolvedValue(
      pipeline.companyId,
    );
    pipelineRepository.findByName.mockResolvedValue(null);
    pipelineRepository.update.mockResolvedValue(pipeline);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePipelineService,
        { provide: 'PipelineRepository', useValue: pipelineRepository },
      ],
    }).compile();

    service = module.get<UpdatePipelineService>(UpdatePipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findById with correct parameters', async () => {
    await service.execute({
      pipelineId: 'any_id',
      updatePipeline: {
        name: 'any_name',
        description: 'any_description',
        active: true,
      },
      userId: 'any_userId',
    });

    expect(pipelineRepository.findById).toBeCalledWith('any_id');
    expect(pipelineRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if pipeline name already exists', async () => {
    pipelineRepository.findById.mockResolvedValueOnce(null);

    const promise = service.execute({
      pipelineId: 'any_id',
      updatePipeline: {
        name: 'any_name',
        description: 'any_description',
        active: true,
      },
      userId: 'any_userId',
    });

    await expect(promise).rejects.toThrow(
      new NotFoundException('Pipeline does not exist'),
    );
  });

  it('should call findCompanyByUserId with correct parameters', async () => {
    await service.execute({
      pipelineId: 'any_id',
      updatePipeline: {
        name: 'any_name',
        description: 'any_description',
        active: true,
      },
      userId: 'any_userId',
    });

    expect(pipelineRepository.findCompanyByUserId).toBeCalledWith('any_userId');

    expect(pipelineRepository.findCompanyByUserId).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if user not have a company', async () => {
    pipelineRepository.findCompanyByUserId.mockResolvedValueOnce(null);

    const promise = service.execute({
      pipelineId: 'any_id',
      updatePipeline: {
        name: 'any_name',
        description: 'any_description',
        active: true,
      },
      userId: 'any_userId',
    });

    await expect(promise).rejects.toThrow(
      new NotFoundException('User does not have a company'),
    );
  });

  it('should throw an error if pipeline not be company', async () => {
    pipelineRepository.findCompanyByUserId.mockResolvedValueOnce(
      'any_company_other_id',
    );

    const promise = service.execute({
      pipelineId: 'any_id',
      updatePipeline: {
        name: 'any_name',
        description: 'any_description',
        active: true,
      },
      userId: 'any_userId',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException(
        'User does not have permission to update this pipeline',
      ),
    );
  });

  it('should throw an error if name the pipeline already exists', async () => {
    pipelineRepository.findByName.mockResolvedValueOnce(pipeline);
    const promise = service.execute({
      pipelineId: 'any_id',
      updatePipeline: {
        name: 'any_name',
        description: 'any_description',
        active: true,
      },
      userId: 'any_userId',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException(
        `Pipeline with name ${pipeline.name} already exists`,
      ),
    );
  });

  it('should returns an pipeline on success', async () => {
    const result = await service.execute({
      pipelineId: 'any_id',
      updatePipeline: {
        name: 'any_name',
        description: 'any_description',
        active: true,
      },
      userId: 'any_userId',
    });

    expect(result).toEqual(pipeline);
  });
});
