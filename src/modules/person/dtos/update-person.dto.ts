import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePersonDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  ownerId?: string;
}
