import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationDto } from '../dtos/auth.dto';
import { AuthenticationService } from '../services/auth.service';

@Controller('api/v1/login')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post()
  async create(@Body() authenticationDto: AuthenticationDto) {
    return await this.authService.execute(authenticationDto);
  }
}
