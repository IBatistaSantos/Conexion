import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Encryption } from '../../../shared/providers/encryption/contracts/encryption';
import { UserRepository } from '../repository';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('EncryptionProvider')
    private readonly encryption: Encryption,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ name, email, password, company }: CreateUserDto) {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    return this.userRepository.createUserAndCompany({
      email,
      password: await this.encryption.hash(password),
      name,
      company: {
        name: company.name,
      },
    });
  }
}
