import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/auth/auth.module';
//import { PipelineModule } from './modules/pipeline/pipeline.module';
import { PrismaModule } from './modules/prisma/prisma.module';
//import { StageModule } from './modules/stage/stage.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
