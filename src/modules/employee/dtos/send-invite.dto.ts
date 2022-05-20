import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendInviteDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  companyId: string;
}
