import { Test, TestingModule } from '@nestjs/testing';
import {
  CompanyRepository,
  UserRepository,
} from '../../../src/modules/user/repository';
import { CreateUserService } from '../../../src/modules/user/services/create-user.service';
import { MockProxy, mock } from 'jest-mock-extended';
import { Encryption } from '../../../src/shared/providers/encryption/contracts/encryption';
import { BadRequestException } from '@nestjs/common';

describe('CreateUserService', () => {
  let service: CreateUserService;

  let userRepository: MockProxy<UserRepository>;
  let companyRepository: MockProxy<CompanyRepository>;
  let encryption: MockProxy<Encryption>;

  beforeAll(() => {
    userRepository = mock();
    companyRepository = mock();
    encryption = mock();

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({
      id: 'userId',
      email: 'email',
      password: 'password',
      name: 'name',
    });

    companyRepository.create.mockResolvedValue({
      id: 'companyId',
      name: 'companyName',
      owner_id: 'userId',
    });

    encryption.hash.mockResolvedValue('passwordHash');
    encryption.compare.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        { provide: 'EncryptionProvider', useValue: encryption },
        { provide: 'UserRepository', useValue: userRepository },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if user already exists', async () => {
    userRepository.findByEmail.mockResolvedValueOnce({
      id: 'id',
      email: 'email',
      name: 'name',
      password: '',
    });
    const promise = service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      company: {
        name: 'any_company_name',
      },
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException(`User with email any_email already exists`),
    );
  });

  it('should call FindByEmail with correct parameters', async () => {
    await service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      company: {
        name: 'any_company_name',
      },
    });

    expect(userRepository.findByEmail).toBeCalledWith('any_email');
  });

  it('should call Create with correct parameters', async () => {
    await service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      company: {
        name: 'any_company_name',
      },
    });

    expect(userRepository.create).toBeCalledWith({
      email: 'any_email',
      name: 'any_name',
      password: 'passwordHash',
    });
  });

  it('should call Hash with correct parameters', async () => {
    await service.execute({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      company: {
        name: 'any_company_name',
      },
    });

    expect(encryption.hash).toBeCalledWith('any_password');
    expect(encryption.hash).toBeCalledTimes(1);
  });
});
