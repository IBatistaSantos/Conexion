import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PersonRepository } from '../repository/person.repository';

type DetailsPersonServiceParams = {
  personId: string;
  companyId: string;
};

@Injectable()
export class DetailsPersonService {
  constructor(
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(params: DetailsPersonServiceParams): Promise<any> {
    const { personId, companyId } = params;

    const person = await this.personRepository.findById(personId);

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (person.companyId !== companyId) {
      throw new UnauthorizedException(
        'You are not authorized to access this person',
      );
    }

    return person;
  }
}
