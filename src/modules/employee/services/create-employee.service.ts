import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserService } from '../../user/services/create-user.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeRepository } from '../repository/employee.repository';

@Injectable()
export class CreateEmployeeService {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,

    private readonly createUserService: CreateUserService,
  ) {}

  async execute(employee: CreateEmployeeDto) {
    const invite = await this.employeeRepository.findByCode(employee.code);

    if (!invite) {
      throw new NotFoundException(
        `Invite with code ${employee.code} not found`,
      );
    }

    if (invite.status === 'ACCEPTED') return;

    const user = await this.createUserService.execute({
      name: invite.name,
      email: invite.email,
      password: employee.password,
    });

    if (!user) {
      throw new BadRequestException('User create failed');
    }

    await this.employeeRepository.create({
      userId: user.id,
      companyId: invite.company_Id,
    });

    await this.employeeRepository.acceptInvite(invite.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
