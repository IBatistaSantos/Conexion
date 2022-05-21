import { IsNotEmpty } from 'class-validator';
import { IsEqualTo } from 'src/shared/decorator/match-field.decorator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  passwordConfirm: string;

  @IsNotEmpty()
  code: string;
}
