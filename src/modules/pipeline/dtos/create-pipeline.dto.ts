import { IsNotEmpty } from 'class-validator';

export class CreatePipelineDto {
  @IsNotEmpty()
  name: string;
  description: string;
}
