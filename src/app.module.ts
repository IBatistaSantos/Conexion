import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { mailerConfig } from './config/mailer';

import { AuthenticationModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { DealModule } from './modules/deal/deal.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { VtexModule } from './modules/integration/vtex/vtex.module';
import { PersonModule } from './modules/person/person.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { StageModule } from './modules/stage/stage.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    MailerModule.forRoot(mailerConfig),
    PrismaModule,
    UserModule,
    AuthenticationModule,
    EmployeeModule,
    CompanyModule,
    PipelineModule,
    StageModule,
    DealModule,
    PersonModule,
    ProductModule,
    VtexModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
