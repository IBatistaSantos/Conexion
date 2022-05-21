import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';

import { CompanyRepository } from '../../../../src/modules/company/repository/company.repository';
import { CreateCompanyService } from '../../../../src/modules/company/services/create-company.service';

import { CreateUserService } from '../../../../src/modules/user/services/create-user.service';
import { Company } from '../../../../src/modules/company/entities/company.entity';

describe('CreateCompanyService', () => {
  let service: CreateCompanyService;

  let companyRepository: MockProxy<CompanyRepository>;
  let createUserService: MockProxy<CreateUserService>;

  const company: Company = {
    id: 'company_id',
    name: 'any_company_name',
    ownerId: 'any_owner_id',
  };

  const user = {
    id: 'any_user_id',
    email: 'any_email',
    name: 'any_name',
    password: 'any_password',
  };

  const createCompanyResponse = {
    id: company.id,
    name: company.name,
    owner: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };

  beforeAll(() => {
    companyRepository = mock();
    createUserService = mock();

    companyRepository.findById.mockResolvedValue(null);
    companyRepository.create.mockResolvedValue(company);

    createUserService.execute.mockResolvedValue(user);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCompanyService,
        { provide: CreateUserService, useValue: createUserService },
        { provide: 'CompanyRepository', useValue: companyRepository },
      ],
    }).compile();

    service = module.get<CreateCompanyService>(CreateCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if user created failed', async () => {
    createUserService.execute.mockResolvedValueOnce(null);
    const promise = service.execute({
      name: 'any_company_name',
      owner: {
        name: 'any_owner_name',
        email: 'any_owner_email',
        password: 'any_owner_password',
      },
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException('Owner create failed'),
    );
  });

  it('should call Create with correct parameters', async () => {
    await service.execute({
      name: 'any_company_name',
      owner: {
        name: 'any_owner_name',
        email: 'any_owner_email',
        password: 'any_owner_password',
      },
    });

    expect(companyRepository.create).toBeCalledWith({
      name: 'any_company_name',
      ownerId: user.id,
    });
    expect(companyRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should returns an user on success', async () => {
    const result = await service.execute({
      name: 'any_company_name',
      owner: {
        name: 'any_owner_name',
        email: 'any_owner_email',
        password: 'any_owner_password',
      },
    });

    expect(result).toEqual(createCompanyResponse);
  });
});
