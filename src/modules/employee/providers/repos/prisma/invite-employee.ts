import { Injectable } from '@nestjs/common';
import { InviteEmployee } from 'src/modules/employee/entities/invite-employee.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { InviteEmployeeRepository } from '../../../repository/invite-employee.repository';

@Injectable()
export class PrismaInviteEmployee implements InviteEmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(params: {
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
      company_Id: invite.companyId,
      created_at: invite.createdAt,
      updated_at: invite.updatedAt,
    };
  }
}
