import { Module } from '@nestjs/common';

import { PipelineController } from './controllers/pipeline.controller';
import { CreatePipelineService } from './services/create-pipeline.service';
import { DeletePipelineService } from './services/delete-pipeline.service';
import { DetailsPipelineService } from './services/details-pipeline.service';
import { ListAllPipelineService } from './services/list-all-pipeline.service';
import { UpdatePipelineService } from './services/update-pipeline.service';

@Module({
  providers: [
    CreatePipelineService,
    UpdatePipelineService,
    DeletePipelineService,
    DetailsPipelineService,
    ListAllPipelineService,
  ],
  controllers: [PipelineController],
  imports: [],
  exports: [DetailsPipelineService],
})
export class PipelineModule {}
