import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CompanyGuard } from 'src/modules/auth/guard/compay.guard';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';

import { SendInviteDto } from '../dtos/send-invite.dto';
import { CreateEmployeeService } from '../services/create-employee.service';
import { SendInviteService } from '../services/send-invite.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Controller('api/v1/employee')
export class EmployeeController {
  constructor(
    private readonly sendInviteEmployeeService: SendInviteService,
    private readonly createEmployeeService: CreateEmployeeService,
  ) {}

  @UseGuards(JwtAuthGuard, CompanyGuard)
  @Post('/invite')
  async invite(@Body() createInviteEmployeeDto: SendInviteDto) {
    return this.sendInviteEmployeeService.execute({
      name: createInviteEmployeeDto.name,
      email: createInviteEmployeeDto.email,
      companyId: createInviteEmployeeDto.companyId,
    });
  }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.createEmployeeService.execute(createEmployeeDto);
  }
}
