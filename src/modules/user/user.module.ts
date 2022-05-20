import { Module } from '@nestjs/common';
import { Bcrypt } from '../../shared/providers/encryption/implementation/bcrypt';

import { CreateUserService } from './services/create-user.service';
import { PrismaUserRepository } from '../../shared/providers/repos/prisma/user-repository';
import { UserController } from './controllers/user.controller';
import { UpdateUserService } from './services/update-user.service';
import { ProfileUserService } from './services/profile-user.service';

@Module({
  imports: [],
  providers: [
    CreateUserService,
    UpdateUserService,
    ProfileUserService,
    { provide: 'EncryptionProvider', useClass: Bcrypt },
    { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
