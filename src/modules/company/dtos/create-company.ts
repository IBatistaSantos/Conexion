import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  owner: {
    name: string;
    email: string;
    password: string;
  };
}
