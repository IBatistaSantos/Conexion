import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CompanyGuard } from 'src/modules/auth/guard/compay.guard';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';

import { SendInviteDto } from '../dtos/send-invite.dto';
import { SendInviteService } from '../services/send-invite.service';
@Controller('api/v1/invite')
export class InviteEmployeeController {
  constructor(private readonly sendInviteEmployeeService: SendInviteService) {}

  @UseGuards(JwtAuthGuard, CompanyGuard)
  @Post()
  async invite(@Body() createInviteEmployeeDto: SendInviteDto) {
    return this.sendInviteEmployeeService.execute({
      name: createInviteEmployeeDto.name,
      email: createInviteEmployeeDto.email,
      companyId: createInviteEmployeeDto.companyId,
    });
  }
}
