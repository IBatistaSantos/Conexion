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

    return {
      accessToken: this.jwtService.sign({
        userId: userAlreadyExists.id,
      }),
      user: {
        id: userAlreadyExists.id,
        email: userAlreadyExists.email,
        name: userAlreadyExists.name,
      },
    };
  }

  async validateUser(payload: any) {
    return await this.userRepository.findById(payload.userId);
  }
}
