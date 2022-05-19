import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserService } from '../services/create-user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserService.execute(createUserDto);
  }
}
