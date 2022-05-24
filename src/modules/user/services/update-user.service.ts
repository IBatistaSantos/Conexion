import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Encryption } from '../../../shared/providers/encryption/contracts/encryption';
import { UserRepository } from '../repository';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';

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
  }: UpdateUserDto): Promise<User> {
    const userAlreadyExists = await this.userRepository.findById(userId);

    if (!userAlreadyExists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (password) {
      if (password !== passwordConfirmation) {
        throw new BadRequestException('Password confirmation does not match');
      }

      password = await this.encryption.hash(password);
    }

    if (email) {
      const isEmailAlreadyRegistered = await this.userRepository.findByEmail(
        email,
      );

      if (isEmailAlreadyRegistered && isEmailAlreadyRegistered.id !== userId) {
        throw new BadRequestException(
          `User with email ${email} already exists`,
        );
      }
    }

    const user = await this.userRepository.update({
      name,
      email,
      password,
      userId,
    });

    const companyId = user.owner ? user.owner.id : user.employees.company.id;
    const companyName = user.owner
      ? user.owner.name
      : user.employees.company.name;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      companyId,
      companyName,
    };
  }
}
