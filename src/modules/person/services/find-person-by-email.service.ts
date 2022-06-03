import { Inject, Injectable } from '@nestjs/common';
import { PersonRepository } from '../repository/person.repository';

@Injectable()
export class FindByEmailPersonService {
  constructor(
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(params: { email: string; companyId: string }): Promise<any> {
    const { email, companyId } = params;

    const person = await this.personRepository.findByEmail({
      email,
      companyId,
    });

    return person;
  }
}
