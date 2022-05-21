import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { DetailsCompanyService } from '../../company/services/details-company.service';
import { EmployeeRepository } from '../repository/employee.repository';

type CreateInviteEmployeRequest = {
  name: string;
  email: string;
  companyId: string;
};

@Injectable()
export class SendInviteService {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
    private readonly detailsCompanyService: DetailsCompanyService,
    private readonly mailService: MailerService,
  ) {}

  async execute(params: CreateInviteEmployeRequest) {
    const { email, name, companyId } = params;
    const code = this.getCode();

    const company = await this.detailsCompanyService.execute(companyId);

    const mail = {
      to: email,
      from: 'noreply@gmail.com',
      subject: 'Invite to join company',
      template: 'invite',
      context: {
        code,
        name,
        companyName: company.name,
        url_front: process.env.URL_FRONT || 'http://localhost:3000',
      },
    };

    await this.mailService.sendMail(mail);

    await this.employeeRepository.createInvite({
      name,
      email,
      companyId,
      code,
    });
  }

  getCode(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
