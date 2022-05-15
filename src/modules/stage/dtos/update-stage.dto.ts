import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStageDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;
}
