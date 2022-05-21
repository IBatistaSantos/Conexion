import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { EmployeeController } from './controllers/employee.controller';
import { PrismaEmployeeRepository } from './providers/repos/prisma/invite-employee';
import { CreateEmployeeService } from './services/create-employee.service';
import { SendInviteService } from './services/send-invite.service';

@Module({
  imports: [CompanyModule],
  providers: [
    SendInviteService,
    CreateEmployeeService,
    {
      provide: 'EmployeeRepository',
      useClass: PrismaEmployeeRepository,
    },
  ],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
