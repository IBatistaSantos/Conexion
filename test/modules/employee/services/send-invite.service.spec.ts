import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { MailerService } from '@nestjs-modules/mailer';

import { SendInviteService } from '../../../../src/modules/employee/services/send-invite.service';
import { EmployeeRepository } from '../../../../src/modules/employee/repository/employee.repository';
import { DetailsCompanyService } from '../../../../src/modules/company/services/details-company.service';

describe('SendInviteService', () => {
  let service: SendInviteService;

  let employeeRepository: MockProxy<EmployeeRepository>;
  let detailsCompanyService: MockProxy<DetailsCompanyService>;
  let mailService: MockProxy<MailerService>;

  beforeAll(() => {
    employeeRepository = mock();

    detailsCompanyService = mock();
    mailService = mock();

    employeeRepository.createInvite.mockResolvedValue({
      code: 'any_code',
      company_Id: 'any_company_id',
      name: 'any_name',
      email: 'any_email',
      id: 'any_id',
      status: 'PENDING',
      created_at: new Date(),
      updated_at: new Date(),
    });

    detailsCompanyService.execute.mockResolvedValue({
      id: 'any_company_id',
      name: 'any_name',
      ownerId: 'any_owner_id',
    });

    mailService.sendMail.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendInviteService,
        { provide: 'EmployeeRepository', useValue: employeeRepository },
        { provide: DetailsCompanyService, useValue: detailsCompanyService },
        { provide: MailerService, useValue: mailService },
      ],
    }).compile();

    service = module.get<SendInviteService>(SendInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call createInvite and sendMail', async () => {
    const spy = jest.spyOn(service, 'getCode');
    spy.mockReturnValue('any_code');
    const params = {
      code: 'any_code',
      name: 'any_name',
      email: 'any_email',
      companyId: 'any_company_id',
    };

    await service.execute(params);

    expect(employeeRepository.createInvite).toHaveBeenCalledWith(params);
    expect(mailService.sendMail).toHaveBeenCalled();
  });
});
