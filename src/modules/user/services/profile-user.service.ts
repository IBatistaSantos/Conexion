import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../repository';

@Injectable()
export class ProfileUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

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
