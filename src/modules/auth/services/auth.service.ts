import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Encryption } from '../../../shared/providers/encryption/contracts/encryption';
import { AuthenticationDto } from '../dtos/auth.dto';

import { UserRepository } from '../../user/repository/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('EncryptionProvider')
    private readonly encryption: Encryption,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: AuthenticationDto) {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (!userAlreadyExists) {
      throw new BadRequestException(`Credentials invalid`);
    }

    const isMatch = await this.encryption.compare(
      password,
      userAlreadyExists.password,
    );
    if (!isMatch) {
      throw new BadRequestException(`Credentials invalid`);
    }

    const companyName = userAlreadyExists.owner
      ? userAlreadyExists.owner.name
      : userAlreadyExists.employees.company.name;

    const companyId = userAlreadyExists.owner
      ? userAlreadyExists.owner.id
      : userAlreadyExists.employees.company.id;

    return {
      accessToken: this.jwtService.sign({
        userId: userAlreadyExists.id,
      }),
      user: {
        id: userAlreadyExists.id,
        email: userAlreadyExists.email,
        name: userAlreadyExists.name,
        companyName,
        companyId,
      },
    };
  }

  async validateUser(payload: any) {
    const user = await this.userRepository.findById(payload.userId);

    const companyName = user.owner
      ? user.owner.name
      : user.employees.company.name;

    const companyId = user.owner ? user.owner.id : user.employees.company.id;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      companyName,
      companyId,
    };
  }
}
