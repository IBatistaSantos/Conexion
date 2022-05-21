import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { ProfileUserService } from '../services/profile-user.service';
import { UpdateUserService } from '../services/update-user.service';

type UpdateUserRequest = Omit<UpdateUserDto, 'userId'>;

@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly updateUserService: UpdateUserService,
    private readonly profileUserService: ProfileUserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@GetUser() user: User, @Body() updateUserDto: UpdateUserRequest) {
    return this.updateUserService.execute({
      email: updateUserDto.email,
      name: updateUserDto.name,
      password: updateUserDto.password,
      passwordConfirmation: updateUserDto.passwordConfirmation,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async profile(@GetUser() user: User) {
    const profile = await this.profileUserService.execute(user.id);
    delete profile.password;
    return profile;
  }
}
