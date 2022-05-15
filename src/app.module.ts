import { Module } from '@nestjs/common';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { StageModule } from './modules/stage/stage.module';

@Module({
  imports: [PipelineModule, PrismaModule, StageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
