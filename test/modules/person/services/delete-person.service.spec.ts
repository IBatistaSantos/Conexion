import { Test, TestingModule } from '@nestjs/testing';
import { DeletePersonService } from '../../../../src/modules/person/services/delete-person.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { PersonRepository } from '../../../../src/modules/person/repository/person.repository';

import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('DeletePersonService', () => {
  let service: DeletePersonService;

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
    personRepository.delete.mockResolvedValue(person);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePersonService,
        { provide: 'PersonRepository', useValue: personRepository },
      ],
    }).compile();

    service = module.get<DeletePersonService>(DeletePersonService);
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

  it('should call delete with the correct parameters', async () => {
    const data = {
      personId: 'any_personId',
      companyId: 'any_company_id',
    };

    await service.execute(data);

    expect(personRepository.delete).toBeCalledWith({
      personId: data.personId,
      companyId: data.companyId,
    });

    expect(personRepository.delete).toHaveBeenCalledTimes(1);
  });
});
