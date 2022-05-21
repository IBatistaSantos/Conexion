import { Employee } from '../entities/employee';
import { InviteEmployee } from '../entities/invite-employee.entity';

export interface EmployeeRepository {
  create(params: CreateEmployeeDto): Promise<Employee>;
  createInvite(params: CreateInviteEmployeeDto): Promise<InviteEmployee>;
  acceptInvite(inviteId: string): Promise<void>;
  findByCode(code: string): Promise<InviteEmployee | undefined>;
}

export type CreateEmployeeDto = {
  userId: string;
  companyId: string;
};

type CreateInviteEmployeeDto = {
  name: string;
  email: string;
  companyId: string;
  code: string;
};
