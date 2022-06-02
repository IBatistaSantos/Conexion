import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../../src/modules/user/repository';
import { UpdateUserService } from '../../../../src/modules/user/services/update-user.service';
import { Encryption } from '../../../../src/shared/providers/encryption/contracts/encryption';

import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1));

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  let userRepository: MockProxy<UserRepository>;
  let encryption: MockProxy<Encryption>;

  const user = {
    id: 'userId',
    email: 'email',
    name: 'name',
    password: 'password',
    companyId: 'ownerId',
    companyName: 'ownerName',
  };

  const resultFindById = {
    id: 'userId',
    email: 'email',
    name: 'name',
    password: 'password',
    owner: {
      id: 'ownerId',
      name: 'ownerName',
    },
  };

  const resultUpdatedUser = {
    id: 'userId',
    email: 'email',
    name: 'name',
    password: 'password',
    owner: {
      id: 'ownerId',
      name: 'ownerName',
    },
  };

  beforeAll(() => {
    userRepository = mock();
    encryption = mock();

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findById.mockResolvedValue(resultFindById);
    userRepository.update.mockResolvedValue(resultUpdatedUser);

    encryption.hash.mockResolvedValue('passwordHash');
    encryption.compare.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        { provide: 'EncryptionProvider', useValue: encryption },
        { provide: 'UserRepository', useValue: userRepository },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if user not exists', async () => {
    userRepository.findById.mockResolvedValueOnce(null);
    const promise = service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password',
      userId: 'any_id',
    });

    await expect(promise).rejects.toThrow(
      new NotFoundException(`User with id any_id not found`),
    );
  });

  it('should throw if password not match with password confirmation', async () => {
    const promise = service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password_confirmation',
      userId: 'any_id',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException('Password confirmation does not match'),
    );
  });

  it('should throw if email updated already exists', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(user);
    const promise = service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password',
      userId: 'any_id',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException(`User with email any_email already exists`),
    );
  });

  it('should returns an user on success', async () => {
    const result = await service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password',
      userId: 'any_id',
    });

    expect(result).toEqual(user);
  });
});
