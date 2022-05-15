import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdateStageDto } from '../dtos/update-stage.dto';

type Request = {
  updateStage: UpdateStageDto;
  stageId: string;
};

@Injectable()
export class UpdateStageService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(params: Request) {
    const { stageId, updateStage } = params;

    const stageAlreadyExists = await this.prismaService.stage.findUnique({
      where: {
        id: stageId,
      },
    });

    if (!stageAlreadyExists) {
      throw new NotFoundException(`Stage with id ${stageId} not found`);
    }

    return this.prismaService.stage.update({
      where: { id: stageId },
      data: updateStage,
    });
  }
}
