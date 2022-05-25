import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  ownerId?: string;
}
