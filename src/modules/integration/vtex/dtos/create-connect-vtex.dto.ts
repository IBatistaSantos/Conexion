import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

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
}
