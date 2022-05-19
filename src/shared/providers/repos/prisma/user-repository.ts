import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/repository/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create({ name, email, password }: CreateUser): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUserAndCompany({
    name,
    email,
    password,
    company,
  }: CreateUserAndCompany) {
    const userAndCompany = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        owner: {
          create: {
            name: company.name,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      id: userAndCompany.id,
      email: userAndCompany.email,
      name: userAndCompany.name,
      created_at: userAndCompany.createdAt,
      updated_at: userAndCompany.updatedAt,
      company: {
        id: userAndCompany.owner.id,
        name: userAndCompany.owner.name,
      },
    };
  }
}

type CreateUser = {
  name: string;
  email: string;
  password: string;
};

type CreateUserAndCompany = CreateUser & {
  company: {
    name: string;
  };
};
