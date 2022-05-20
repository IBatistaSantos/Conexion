import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaUserRepository } from 'src/shared/providers/repos/prisma/user-repository';
import { Bcrypt } from 'src/shared/providers/encryption/implementation/bcrypt';
import { AuthenticationService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secret',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthenticationService,
    { provide: 'EncryptionProvider', useClass: Bcrypt },
    { provide: 'UserRepository', useClass: PrismaUserRepository },
    JwtStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [],
})
export class AuthenticationModule {}
