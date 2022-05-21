import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { CreateEmployeeService } from '../../../../src/modules/employee/services/create-employee.service';
import { EmployeeRepository } from '../../../../src/modules/employee/repository/employee.repository';
import { CreateUserService } from '../../../../src/modules/user/services/create-user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CreateEmployeeService', () => {
  let service: CreateEmployeeService;

  let employeeRepository: MockProxy<EmployeeRepository>;
  let createUserService: MockProxy<CreateUserService>;

  const user = {
    id: 'any_user_id',
    email: 'any_email',
    name: 'any_name',
    password: 'any_password',
  };

  beforeAll(() => {
    employeeRepository = mock();
    createUserService = mock();

    employeeRepository.findByCode.mockResolvedValue({
      id: 'any_id',
      code: 'any_code',
      status: 'PENDING',
      company_Id: 'any_company_id',
      email: 'any_email',
      name: 'any_name',
      created_at: new Date(),
      updated_at: new Date(),
    });
    employeeRepository.create.mockResolvedValue({
      id: 'employee_id',
      companyId: 'any_company_id',
      userId: 'any_user_id',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    employeeRepository.acceptInvite.mockResolvedValue(null);

    createUserService.execute.mockResolvedValue(user);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEmployeeService,
        { provide: 'EmployeeRepository', useValue: employeeRepository },
        { provide: CreateUserService, useValue: createUserService },
      ],
    }).compile();

    service = module.get<CreateEmployeeService>(CreateEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if code not found', async () => {
    employeeRepository.findByCode.mockResolvedValueOnce(null);
    const promise = service.execute({
      code: 'any_code',
      password: 'any_password',
      passwordConfirm: 'any_password_confirm',
    });

    await expect(promise).rejects.toThrow(
      new NotFoundException(`Invite with code any_code not found`),
    );
  });

  it('should throw an error if user created failed', async () => {
    createUserService.execute.mockResolvedValueOnce(null);
    const promise = service.execute({
      code: 'any_code',
      password: 'any_password',
      passwordConfirm: 'any_password_confirm',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException('User create failed'),
    );
  });

  it('should call create with correct parameters', async () => {
    await service.execute({
      code: 'any_code',
      password: 'any_password',
      passwordConfirm: 'any_password_confirm',
    });

    expect(employeeRepository.create).toBeCalledWith({
      companyId: 'any_company_id',
      userId: 'any_user_id',
    });
    expect(employeeRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should call update with correct parameters', async () => {
    await service.execute({
      code: 'any_code',
      password: 'any_password',
      passwordConfirm: 'any_password_confirm',
    });

    expect(employeeRepository.acceptInvite).toBeCalledWith('any_id');
    expect(employeeRepository.acceptInvite).toHaveBeenCalledTimes(1);
  });

  it('should employee an user on success', async () => {
    const result = await service.execute({
      code: 'any_code',
      password: 'any_password',
      passwordConfirm: 'any_password_confirm',
    });

    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  });
});
