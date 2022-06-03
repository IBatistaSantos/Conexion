import { Test, TestingModule } from '@nestjs/testing';
import { DetailsPersonService } from '../../../../src/modules/person/services/detail-person.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { PersonRepository } from '../../../../src/modules/person/repository/person.repository';

import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('DetailsPersonService', () => {
  let service: DetailsPersonService;

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

    personRepository.findById.mockResolvedValue(person);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailsPersonService,
        { provide: 'PersonRepository', useValue: personRepository },
      ],
    }).compile();

    service = module.get<DetailsPersonService>(DetailsPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findById with correct parameters', async () => {
    const data = {
      personId: 'any_personId',
      companyId: 'any_company_id',
    };

    await service.execute(data);

    expect(personRepository.findById).toBeCalledWith(data.personId);
    expect(personRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if person not found', async () => {
    personRepository.findById.mockResolvedValueOnce(false);
    const data = {
      personId: 'any_personId',
      companyId: 'any_companyId',
    };
    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new NotFoundException('Person not found'),
    );
  });

  it('should throw an error if person not belong to company', async () => {
    const data = {
      personId: 'any_personId',
      companyId: 'any_other_companyId',
    };
    const promise = service.execute(data);

    await expect(promise).rejects.toThrow(
      new UnauthorizedException('You are not authorized to access this person'),
    );
  });

  it('should returns an person on success', async () => {
    const data = {
      personId: 'any_personId',
      companyId: 'any_company_id',
    };

    const result = await service.execute(data);

    expect(result).toEqual(person);
  });
});
