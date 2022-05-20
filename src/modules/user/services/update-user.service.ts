import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Encryption } from '../../../shared/providers/encryption/contracts/encryption';
import { UserRepository } from '../repository';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject('EncryptionProvider')
    private readonly encryption: Encryption,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    name,
    email,
    password,
    passwordConfirmation,
    userId,
  }: UpdateUserDto) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (password) {
      if (password !== passwordConfirmation) {
        throw new BadRequestException('Password confirmation does not match');
      }

      password = await this.encryption.hash(password);
    }

    if (email) {
      const userAlreadyExists = await this.userRepository.findByEmail(email);

      if (userAlreadyExists && userAlreadyExists.id !== userId) {
        throw new BadRequestException(
          `User with email ${email} already exists`,
        );
      }
    }

    return this.userRepository.update({
      name,
      email,
      password,
      userId,
    });
  }
}
