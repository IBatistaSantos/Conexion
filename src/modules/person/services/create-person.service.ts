import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PersonRepository } from '../repository/person.repository';

type CreatePersonServiceParams = {
  name: string;
  email: string;
  creatorId?: string;
  userId: string;
  companyId: string;
};

@Injectable()
export class CreatePersonService {
  constructor(
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(params: CreatePersonServiceParams): Promise<any> {
    try {
      const { name, email, creatorId, companyId, userId } = params;

      console.log(params);

      if (creatorId) {
        const hasCompanyCreator = await this.personRepository.hasCompanyCreator(
          {
            companyId,
            creatorId,
          },
        );

        if (!hasCompanyCreator) {
          throw new UnauthorizedException(
            `'The person's owner is not a company'`,
          );
        }
      }

      return this.personRepository.create({
        name,
        email,
        ownerId: creatorId ?? userId,
        companyId,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
