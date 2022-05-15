import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePipelineDto } from '../dtos/create-pipeline.dto';

@Injectable()
export class CreatePipelineService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(createPipelineDto: CreatePipelineDto) {
    const { name } = createPipelineDto;

    const pipelineAlreadyExists = await this.prismaService.pipeline.findUnique({
      where: { name },
    });

    if (pipelineAlreadyExists) {
      throw new BadRequestException(
        `Pipeline with name ${name} already exists`,
      );
    }

    return this.prismaService.pipeline.create({
      data: createPipelineDto,
    });
  }
}
