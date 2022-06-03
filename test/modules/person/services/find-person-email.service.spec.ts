import { Test, TestingModule } from '@nestjs/testing';
import { FindByEmailPersonService } from '../../../../src/modules/person/services/find-person-by-email.service';

import { MockProxy, mock } from 'jest-mock-extended';
import { PersonRepository } from '../../../../src/modules/person/repository/person.repository';

describe('FindByEmailPersonService', () => {
  let service: FindByEmailPersonService;

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

    personRepository.findByEmail.mockResolvedValue(person);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByEmailPersonService,
        { provide: 'PersonRepository', useValue: personRepository },
      ],
    }).compile();

    service = module.get<FindByEmailPersonService>(FindByEmailPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findByEmail with correct parameters', async () => {
    const data = {
      email: 'any_email',
      companyId: 'any_company_id',
    };

    await service.execute(data);

    expect(personRepository.findByEmail).toBeCalledWith({
      email: data.email,
      companyId: data.companyId,
    });
    expect(personRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  it('should return perosn on success', async () => {
    const result = await service.execute({
      email: 'any_email',
      companyId: 'any_company_id',
    });

    expect(result).toEqual(person);
  });
});
