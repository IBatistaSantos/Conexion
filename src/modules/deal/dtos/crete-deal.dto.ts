import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDealDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  stageId: string;

  @IsOptional()
  @IsNotEmpty()
  userId: string;
}
