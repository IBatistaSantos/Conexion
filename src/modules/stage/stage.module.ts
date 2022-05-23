import { Module } from '@nestjs/common';
import { PipelineModule } from '../pipeline/pipeline.module';
import { StageController } from './controlers/stage.controller';
import { PrismaStageRepository } from './provider/repos/prisma/stage.repository';
import { CreateStageService } from './services/create-stage.service';
import { DeleteBulkStageService } from './services/delete-multi-stage.service';
import { DeleteStageService } from './services/delete-stage.service';
import { DetailsStageService } from './services/details-stage.service';
import { UpdateStageService } from './services/update-stage.service';

@Module({
  providers: [
    DetailsStageService,
    CreateStageService,
    UpdateStageService,
    DeleteStageService,
    DeleteBulkStageService,
    { provide: 'StageRepository', useClass: PrismaStageRepository },
  ],
  controllers: [StageController],
  imports: [PipelineModule],
})
export class StageModule {}
