import { Test, TestingModule } from '@nestjs/testing';
import { CreatePersonService } from '../../../../src/modules/person/services/create-person.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { PersonRepository } from '../../../../src/modules/person/repository/person.repository';

import { UnauthorizedException } from '@nestjs/common';

describe('CreatePersonService', () => {
  let service: CreatePersonService;

  let personRepository: MockProxy<PersonRepository>;

  const person = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    ownerId: 'any_owner_id',
    companyId: 'any_company_id',
  };

  beforeAll(() => {
    personRepository = mock();

    personRepository.hasCompanyCreator.mockResolvedValue(true);
    personRepository.create.mockResolvedValue(person);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePersonService,
        { provide: 'PersonRepository', useValue: personRepository },
      ],
    }).compile();

    service = module.get<CreatePersonService>(CreatePersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call hasCompanyCreator with correct parameters', async () => {
    const params = {
      companyId: 'any_companyId',
      creatorId: 'any_creatorId',
      email: 'any_email',
      name: 'any_name',
      userId: 'any_userId',
    };

    await service.execute(params);

    expect(personRepository.hasCompanyCreator).toBeCalledWith({
      companyId: params.companyId,
      creatorId: params.creatorId,
    });
    expect(personRepository.hasCompanyCreator).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if creator not have company', async () => {
    personRepository.hasCompanyCreator.mockResolvedValueOnce(false);
    const data = {
      companyId: 'any_companyId',
      creatorId: 'any_creatorId',
      email: 'any_email',
      name: 'any_name',
      userId: 'any_userId',
    };
    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new UnauthorizedException("The person's owner is not a company"),
    );
  });

  it('should call create with the correct parameters', async () => {
    const data = {
      companyId: 'any_companyId',
      creatorId: 'any_creatorId',
      email: 'any_email',
      name: 'any_name',
      userId: 'any_userId',
    };
    await service.execute(data);

    expect(personRepository.create).toBeCalledWith({
      name: data.name,
      email: data.email,
      ownerId: data.creatorId ?? data.userId,
      companyId: data.companyId,
    });

    expect(personRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should returns an person on success', async () => {
    const data = {
      companyId: 'any_companyId',
      creatorId: 'any_creatorId',
      email: 'any_email',
      name: 'any_name',
      userId: 'any_userId',
    };
    const result = await service.execute(data);

    expect(result).toEqual(person);
  });
});
