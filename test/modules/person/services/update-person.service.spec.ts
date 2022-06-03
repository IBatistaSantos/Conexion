import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePersonService } from '../../../../src/modules/person/services/update-person.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { PersonRepository } from '../../../../src/modules/person/repository/person.repository';

import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UpdatePersonService', () => {
  let service: UpdatePersonService;

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
    personRepository.findById.mockResolvedValue(person);
    personRepository.update.mockResolvedValue(person);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePersonService,
        { provide: 'PersonRepository', useValue: personRepository },
      ],
    }).compile();

    service = module.get<UpdatePersonService>(UpdatePersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findById with correct parameters', async () => {
    const data = {
      personId: 'any_person_id',
      data: {
        name: 'any_name',
        email: 'any_email',
      },
      companyId: 'any_company_id',
      userId: 'any_user_id',
    };

    await service.execute(data);

    expect(personRepository.findById).toBeCalledWith(data.personId);
    expect(personRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if person not found', async () => {
    personRepository.findById.mockResolvedValueOnce(null);
    const data = {
      personId: 'any_person_id',
      data: {
        name: 'any_name',
        email: 'any_email',
      },
      companyId: 'any_company_id',
      userId: 'any_user_id',
    };
    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new NotFoundException('Person not found'),
    );
  });

  it('should throw if person not have company', async () => {
    const data = {
      personId: 'any_person_id',
      data: {
        name: 'any_name',
        email: 'any_email',
      },
      companyId: 'other_company_id',
      userId: 'any_user_id',
    };
    const promise = service.execute(data);

    expect(promise).rejects.toThrow(
      new UnauthorizedException('You are not authorized to access this person'),
    );
  });

  it('should throws if creator not have company', async () => {
    personRepository.hasCompanyCreator.mockResolvedValueOnce(false);
    const data = {
      personId: 'any_person_id',
      data: {
        name: 'any_name',
        email: 'any_email',
        ownerId: 'other_company_id',
      },
      companyId: 'any_company_id',
      userId: 'any_user_id',
    };
    const promise = service.execute(data);

    expect(promise).rejects.toThrow(
      new UnauthorizedException("The person's owner is not a company"),
    );
  });

  it('should call update with correct parameters', async () => {
    const data = {
      personId: 'any_person_id',
      data: {
        name: 'any_name',
        email: 'any_email',
      },
      companyId: 'any_company_id',
      userId: 'any_user_id',
    };

    await service.execute(data);

    expect(personRepository.update).toBeCalledWith({
      personId: data.personId,
      email: data.data.email,
      name: data.data.name,
      ownerId: data.userId,
    });
    expect(personRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should return person on success', async () => {
    const data = {
      personId: 'any_person_id',
      data: {
        name: 'any_name',
        email: 'any_email',
      },
      companyId: 'any_company_id',
      userId: 'any_user_id',
    };

    const result = await service.execute(data);

    expect(result).toEqual(person);
  });
});
