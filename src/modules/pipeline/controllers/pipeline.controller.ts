import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { CompanyGuard } from '../../auth/guard/compay.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

import { CreatePipelineDto } from '../dtos/create-pipeline.dto';
import { UpdatePipelineDto } from '../dtos/update-pipeline.dto';

import { CreatePipelineService } from '../services/create-pipeline.service';
import { DeletePipelineService } from '../services/delete-pipeline.service';
import { DetailsPipelineService } from '../services/details-pipeline.service';
import { ListAllPipelineService } from '../services/list-all-pipeline.service';
import { UpdatePipelineService } from '../services/update-pipeline.service';
import { ListDealPipelineService } from '../services/list-deal-pipeline.service';

@Controller('api/v1/pipeline')
export class PipelineController {
  constructor(
    private createPipelineService: CreatePipelineService,
    private updatePipelineService: UpdatePipelineService,
    private deletePipelineService: DeletePipelineService,
    private detailsPipelineService: DetailsPipelineService,
    private listAllPipelines: ListAllPipelineService,
    private listDealPipelineService: ListDealPipelineService,
  ) {}

  @UseGuards(JwtAuthGuard, CompanyGuard)
  @Post()
  async create(@Body() createPipelineDto: CreatePipelineDto) {
    return this.createPipelineService.execute(createPipelineDto);
  }

  @Put(':pipeline_id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('pipeline_id') pipelineId: string,
    @Body() updatePipeline: UpdatePipelineDto,
    @GetUser() user: User,
  ) {
    return this.updatePipelineService.execute({
      pipelineId,
      updatePipeline,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':pipeline_id')
  async delete(
    @GetUser() user: User,
    @Param('pipeline_id') pipelineId: string,
  ) {
    return this.deletePipelineService.execute({
      pipelineId,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':pipeline_id')
  async details(
    @GetUser() user: User,
    @Param('pipeline_id') pipelineId: string,
  ) {
    return this.detailsPipelineService.execute({
      pipelineId,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@GetUser() user: User) {
    return this.listAllPipelines.execute(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':pipeline_id/deal')
  async listDealPipeline(@Param('pipeline_id') pipelineId: string) {
    return this.listDealPipelineService.execute(pipelineId);
  }
}
