import { InviteEmployee } from '../entities/invite-employee.entity';

export interface InviteEmployeeRepository {
  create(params: CreateInviteEmployeeDto): Promise<InviteEmployee>;
}

type CreateInviteEmployeeDto = {
  name: string;
  email: string;
  companyId: string;
  code: string;
};
