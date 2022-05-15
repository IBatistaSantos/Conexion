import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePipelineDto } from '../dtos/create-pipeline.dto';
import { UpdatePipelineDto } from '../dtos/update-pipeline.dto';
import { CreatePipelineService } from '../services/create-pipeline.service';
import { DeletePipelineService } from '../services/delete-pipeline.service';
import { DetailsPipelineService } from '../services/details-pipeline.service';
import { ListAllPipelineService } from '../services/list-all-pipeline.service';
import { UpdatePipelineService } from '../services/update-pipeline.service';

@Controller('api/v1/pipeline')
export class PipelineController {
  constructor(
    private createPipelineService: CreatePipelineService,
    private updatePipelineService: UpdatePipelineService,
    private deletePipelineService: DeletePipelineService,
    private detailsPipelineService: DetailsPipelineService,
    private listAllPipelines: ListAllPipelineService,
  ) {}

  @Post()
  async create(@Body() createPipelineDto: CreatePipelineDto) {
    return this.createPipelineService.execute(createPipelineDto);
  }

  @Put(':pipeline_id')
  async update(
    @Param('pipeline_id') pipelineId: string,
    @Body() updatePipeline: UpdatePipelineDto,
  ) {
    return this.updatePipelineService.execute({
      pipelineId,
      updatePipeline,
    });
  }

  @Delete(':pipeline_id')
  async delete(@Param('pipeline_id') pipelineId: string) {
    return this.deletePipelineService.execute(pipelineId);
  }

  @Get(':pipeline_id')
  async details(@Param('pipeline_id') pipelineId: string) {
    return this.detailsPipelineService.execute(pipelineId);
  }

  @Get()
  async list() {
    return this.listAllPipelines.execute();
  }
}
