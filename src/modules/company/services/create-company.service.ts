import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserService } from 'src/modules/user/services/create-user.service';
import { CreateCompanyDto } from '../dtos/create-company';

import { CompanyRepository } from '../repository/company.repository';

@Injectable()
export class CreateCompanyService {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,

    private readonly createUserService: CreateUserService,
  ) {}

  async execute(createCompanyDto: CreateCompanyDto) {
    const user = await this.createUserService.execute({
      name: createCompanyDto.owner.name,
      email: createCompanyDto.owner.email,
      password: createCompanyDto.owner.password,
    });

    if (!user) {
      throw new BadRequestException('Owner create failed');
    }

    const company = await this.companyRepository.create({
      name: createCompanyDto.name,
      ownerId: user.id,
    });

    return {
      id: company.id,
      name: company.name,
      owner: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
