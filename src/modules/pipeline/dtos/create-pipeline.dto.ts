import { IsNotEmpty } from 'class-validator';

export class CreatePipelineDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  companyId: string;

  description: string;
}
