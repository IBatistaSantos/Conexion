import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';

import { AuthenticationService } from '../../../../src/modules/auth/services/auth.service';

import { UserRepository } from '../../../../src/modules/user/repository';
import { Encryption } from '../../../../src/shared/providers/encryption/contracts/encryption';
import { JwtService } from '@nestjs/jwt';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  let userRepository: MockProxy<UserRepository>;
  let encryption: MockProxy<Encryption>;
  let jwtService: MockProxy<JwtService>;

  const user = {
    id: 'any_user_id',
    email: 'any_email',
    name: 'any_name',
    password: 'any_password',
    owner: {
      id: 'any_owner_id',
      name: 'any_owner_name',
    },
  };

  beforeAll(() => {
    userRepository = mock();
    encryption = mock();
    jwtService = mock();

    userRepository.findByEmail.mockResolvedValue(user);
    encryption.compare.mockResolvedValue(true);
    jwtService.sign.mockReturnValue('any_token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: 'EncryptionProvider', useValue: encryption },
        { provide: 'UserRepository', useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if user with email does not exist', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    const promise = service.execute({
      email: 'any_email',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException(`Credentials invalid`),
    );
  });

  it('should throw an error if password is invalid', async () => {
    encryption.compare.mockResolvedValueOnce(null);
    const promise = service.execute({
      email: 'any_email',
      password: 'any_password',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException(`Credentials invalid`),
    );
  });

  it('should returns an user on success', async () => {
    const result = await service.execute({
      email: 'any_email',
      password: 'any_password',
    });

    expect(result).toEqual({
      accessToken: 'any_token',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyName: user.owner.name,
        companyId: user.owner.id,
      },
    });
  });
});
