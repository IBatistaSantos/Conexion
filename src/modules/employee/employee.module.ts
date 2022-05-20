import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { InviteEmployeeController } from './controllers/invite.controller';
import { PrismaInviteEmployee } from './providers/repos/prisma/invite-employee';
import { SendInviteService } from './services/send-invite.service';

@Module({
  imports: [CompanyModule],
  providers: [
    SendInviteService,
    {
      provide: 'InviteEmployeeRepository',
      useClass: PrismaInviteEmployee,
    },
  ],
  controllers: [InviteEmployeeController],
})
export class EmployeeModule {}
