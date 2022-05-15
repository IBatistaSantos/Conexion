import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePipelineDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  active: boolean;
}
