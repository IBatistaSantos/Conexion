import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type Request = {
  stageId: string;
};

@Injectable()
export class DetailsStageService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(params: Request) {
    const { stageId } = params;

    const stageDetails = await this.prismaService.stage.findUnique({
      where: {
        id: stageId,
      },
      include: {
        pipeline: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    if (!stageDetails) {
      throw new NotFoundException(`Stage with id ${stageId} not found`);
    }

    return stageDetails;
  }
}
