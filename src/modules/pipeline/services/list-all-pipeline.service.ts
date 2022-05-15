import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ListAllPipelineService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute() {
    return this.prismaService.pipeline.findMany({
      where: { active: true },
    });
  }
}
