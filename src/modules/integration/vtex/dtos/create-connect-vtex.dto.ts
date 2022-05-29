import { IsBoolean, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class CreateAuthenticationVtexDto {
  @IsNotEmpty()
  appKey: string;

  @IsNotEmpty()
  appToken: string;

  @IsOptional()
  @IsBoolean()
  integrationOrder: boolean;

  @IsOptional()
  @IsBoolean()
  integrationProduct: boolean;

  @ValidateIf((req) => req.integrationOrder)
  @IsNotEmpty()
  stageId: string;
}
