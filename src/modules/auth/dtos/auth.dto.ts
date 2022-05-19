import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticationDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
