import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type Request = {
  ids: string;
};

@Injectable()
export class DeleteBulkStageService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(params: Request) {
    const { ids } = params;

    const stagesToDelete = ids.split(',');

    await this.prismaService.stage.deleteMany({
      where: {
        id: {
          in: stagesToDelete,
        },
      },
    });
  }
}
