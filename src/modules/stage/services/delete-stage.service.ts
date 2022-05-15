import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type Request = {
  stageId: string;
};

@Injectable()
export class DeleteStageService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(params: Request) {
    const { stageId } = params;

    const stageAlreadyExists = await this.prismaService.stage.findUnique({
      where: {
        id: stageId,
      },
    });

    if (!stageAlreadyExists) {
      throw new NotFoundException(`Stage with id ${stageId} not found`);
    }

    await this.prismaService.stage.delete({
      where: { id: stageId },
    });
  }
}
