import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { CreateUserService } from '../services/create-user.service';
import { ProfileUserService } from '../services/profile-user.service';
import { UpdateUserService } from '../services/update-user.service';

type UpdateUserRequest = Omit<UpdateUserDto, 'userId'>;

@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly profileUserService: ProfileUserService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserService.execute(createUserDto);
  }

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
