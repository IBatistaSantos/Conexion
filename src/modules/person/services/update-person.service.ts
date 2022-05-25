import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdatePersonDto } from '../dtos/update-person.dto';

import { PersonRepository } from '../repository/person.repository';

type DetailsPersonServiceParams = {
  personId: string;
  companyId: string;
  userId: string;

  data: UpdatePersonDto;
};

@Injectable()
export class UpdatePersonService {
  constructor(
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(params: DetailsPersonServiceParams): Promise<any> {
    const { personId, data, companyId, userId } = params;

    const person = await this.personRepository.findById(personId);

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (person.companyId !== companyId) {
      throw new UnauthorizedException(
        'You are not authorized to access this person',
      );
    }

    if (data.ownerId) {
      const ownerInCompany = await this.personRepository.hasCompanyCreator({
        companyId: person.companyId,
        creatorId: data.ownerId,
      });

      if (!ownerInCompany) {
        throw new UnauthorizedException("The person's owner is not a company");
      }
    }

    return this.personRepository.update({
      personId,
      email: data.email,
      name: data.name,
      ownerId: data.ownerId ?? userId,
    });
  }
}
