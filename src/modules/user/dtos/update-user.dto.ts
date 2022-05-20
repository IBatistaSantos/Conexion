import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { IsEqualTo } from '../../../shared/decorator/match-field.decorator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @ValidateIf((o) => o.password)
  @IsEqualTo('password')
  passwordConfirmation: string;

  @IsNotEmpty()
  userId: string;
}
