import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

import { UserRepository } from '../../../../src/modules/user/repository';
import { DetailsUserService } from '../../../../src/modules/user/services/details-user.service';

describe('DetailsUserService', () => {
  let service: DetailsUserService;
  let userRepository: MockProxy<UserRepository>;

  const user = {
    id: 'any_id',
    email: 'any_email',
    name: 'any_name',
    password: 'any_password',
    companyId: 'any_company_id',
    companyName: 'any_company_name',
  };

  const resultFindById = {
    id: 'any_id',
    email: 'any_email',
    name: 'any_name',
    password: 'any_password',
    owner: {
      id: 'any_company_id',
      name: 'any_company_name',
    },
  };

  beforeAll(() => {
    userRepository = mock();
    userRepository.findById.mockResolvedValue(resultFindById);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailsUserService,
        { provide: 'UserRepository', useValue: userRepository },
      ],
    }).compile();

    service = module.get<DetailsUserService>(DetailsUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if user not exists', async () => {
    userRepository.findById.mockResolvedValueOnce(null);
    const promise = service.execute('any_id');

    await expect(promise).rejects.toThrow(
      new NotFoundException(`User with id any_id not found`),
    );
  });

  it('should call FindById with correct parameters', async () => {
    await service.execute('any_id');

    expect(userRepository.findById).toBeCalledWith('any_id');
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should returns an user on success', async () => {
    const result = await service.execute('any_id');
    expect(result).toEqual(user);
  });
});
