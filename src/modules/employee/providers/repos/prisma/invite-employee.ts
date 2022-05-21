import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { InviteEmployee } from 'src/modules/employee/entities/invite-employee.entity';
import {
  EmployeeRepository,
  CreateEmployeeDto,
} from 'src/modules/employee/repository/employee.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async acceptInvite(inviteId: string): Promise<void> {
    await this.prisma.inviteEmployee.update({
      where: {
        id: inviteId,
      },
      data: {
        status: 'ACCEPTED',
      },
    });
  }
  create(params: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data: {
        userId: params.userId,
        companyId: params.companyId,
      },
    });
  }
  async findByCode(code: string): Promise<InviteEmployee> {
    const invite = await this.prisma.inviteEmployee.findUnique({
      where: {
        code,
      },
    });

    if (!invite) return undefined;

    return {
      id: invite.id,
      code: invite.code,
      name: invite.name,
      email: invite.email,
      status: invite.status,
      company_Id: invite.companyId,
      created_at: invite.createdAt,
      updated_at: invite.updatedAt,
    };
  }
  async createInvite(params: {
    name: string;
    email: string;
    companyId: string;
    code: string;
  }): Promise<InviteEmployee> {
    const invite = await this.prisma.inviteEmployee.create({
      data: {
        name: params.name,
        email: params.email,
        code: params.code,
        companyId: params.companyId,
      },
    });

    return {
      id: invite.id,
      name: invite.name,
      email: invite.email,
      code: invite.code,
      status: invite.status,
      company_Id: invite.companyId,
      created_at: invite.createdAt,
      updated_at: invite.updatedAt,
    };
  }
}
