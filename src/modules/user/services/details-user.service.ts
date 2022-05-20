import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../repository';

@Injectable()
export class DetailsUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return this.userRepository.findById(userId);
  }
}
