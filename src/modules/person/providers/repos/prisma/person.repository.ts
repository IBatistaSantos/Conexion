import { Injectable } from '@nestjs/common';
import {
  CreatePersonParams,
  DeletePersonParams,
  FindByEmailPersonParams,
  HasCompanyCreatorParams,
  PersonRepository,
  UpdatePersonParams,
} from 'src/modules/person/repository/person.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PrismaPersonRepository implements PersonRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findByEmail(params: FindByEmailPersonParams): Promise<any> {
    return this.prismaService.person.findFirst({
      where: {
        email: params.email,
        AND: {
          companyId: params.companyId,
        },
      },
    });
  }

  delete(params: DeletePersonParams): Promise<any> {
    return this.prismaService.person.deleteMany({
      where: {
        id: params.personId,
        AND: {
          companyId: params.companyId,
        },
      },
    });
  }
  update(params: UpdatePersonParams): Promise<any> {
    return this.prismaService.person.update({
      where: {
        id: params.personId,
      },
      data: {
        name: params.name || undefined,
        email: params.email || undefined,
        owner_id: params.ownerId || undefined,
      },
    });
  }

  findById(personId: string): Promise<any> {
    return this.prismaService.person.findUnique({
      where: {
        id: personId,
      },
    });
  }
  create(params: CreatePersonParams): Promise<any> {
    return this.prismaService.person.create({
      data: {
        email: params.email,
        name: params.name,
        companyId: params.companyId,
        owner_id: params.ownerId,
      },
    });
  }

  async hasCompanyCreator(params: HasCompanyCreatorParams): Promise<boolean> {
    const { companyId, creatorId } = params;
    const user = await this.prismaService.user.findFirst({
      where: {
        id: creatorId,
      },
      include: {
        owner: true,
        employees: true,
      },
    });

    if (!user) {
      return false;
    }

    const companyIdCreator = user.owner
      ? user.owner.id
      : user.employees.companyId;

    if (companyId !== companyIdCreator) {
      return false;
    }

    return true;
  }
}
