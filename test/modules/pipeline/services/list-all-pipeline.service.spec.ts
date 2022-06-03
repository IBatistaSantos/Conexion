import { Test, TestingModule } from '@nestjs/testing';
import { ListAllPipelineService } from '../../../../src/modules/pipeline/services/list-all-pipeline.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { PipelineRepository } from '../../../../src/modules/pipeline/repository/pipeline.repository';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('ListAllPipelineService', () => {
  let service: ListAllPipelineService;

  let pipelineRepository: MockProxy<PipelineRepository>;

  const pipelines = [
    {
      id: 'any_id',
      name: 'any_name',
      companyId: 'any_companyId',
      description: 'any_description',
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    },
    {
      id: 'any_other_id',
      name: 'any_name',
      companyId: 'any_company_other',
      description: 'any_description',
      createdAt: new Date(2020, 1, 1),
      updatedAt: new Date(2020, 1, 1),
    },
  ];

  beforeAll(() => {
    pipelineRepository = mock();
    pipelineRepository.findAll.mockResolvedValue(pipelines);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllPipelineService,
        { provide: 'PipelineRepository', useValue: pipelineRepository },
      ],
    }).compile();

    service = module.get<ListAllPipelineService>(ListAllPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll with correct parameters', async () => {
    await service.execute('any_companyId');

    expect(pipelineRepository.findAll).toBeCalledWith('any_companyId');
    expect(pipelineRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return pipeline on success', async () => {
    const result = await service.execute('any_companyId');

    expect(result.length).toBe(2);
    expect(result).toEqual(pipelines);
  });
});
