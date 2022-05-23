import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { mailerConfig } from './config/mailer';

import { AuthenticationModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { StageModule } from './modules/stage/stage.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MailerModule.forRoot(mailerConfig),
    PrismaModule,
    UserModule,
    AuthenticationModule,
    EmployeeModule,
    CompanyModule,
    PipelineModule,
    StageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
