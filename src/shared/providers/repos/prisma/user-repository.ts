import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  UserRepository,
  CreateUserResult,
} from 'src/modules/user/repository/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  update({
    name,
    email,
    password,
    userId,
  }: {
    name?: string;
    email?: string;
    password?: string;
    userId: string;
  }): Promise<CreateUserResult> {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name || undefined,
        email: email || undefined,
        password: password || undefined,
      },
      include: {
        owner: true,
        employees: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        employees: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return user;
  }
  async create({
    name,
    email,
    password,
  }: CreateUser): Promise<CreateUserResult> {
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  async findByEmail(email: string): Promise<CreateUserResult> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        owner: {},
        employees: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
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
