import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

import { CompanyRepository } from '../../../../src/modules/company/repository/company.repository';
import { DetailsCompanyService } from '../../../../src/modules/company/services/details-company.service';

import { Company } from '../../../../src/modules/company/entities/company.entity';

describe('DetailsCompanyService', () => {
  let service: DetailsCompanyService;

  let companyRepository: MockProxy<CompanyRepository>;
  let companyId: string;

  let company: Company;

  beforeAll(() => {
    companyId = 'company_id';

    company = {
      id: 'company_id',
      name: 'any_company_name',
      ownerId: 'any_owner_id',
    };
    companyRepository = mock();
    companyRepository.findById.mockResolvedValue(company);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailsCompanyService,
        { provide: 'CompanyRepository', useValue: companyRepository },
      ],
    }).compile();

    service = module.get<DetailsCompanyService>(DetailsCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if company not found', async () => {
    companyRepository.findById.mockResolvedValueOnce(null);
    const promise = service.execute(companyId);

    await expect(promise).rejects.toThrow(
      new NotFoundException(`Company with id company_id not found`),
    );
  });

  it('should call FindById with correct parameters', async () => {
    await service.execute(companyId);

    expect(companyRepository.findById).toBeCalledWith(companyId);
    expect(companyRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should returns an company on success', async () => {
    const result = await service.execute(companyId);
    expect(result).toEqual(company);
  });
});
