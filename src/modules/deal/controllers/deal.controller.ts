import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { CreateDealDto } from '../dtos/crete-deal.dto';
import { CreateDealService } from '../services/create-deal.service';
import { ListDealPipelineService } from '../services/list-deal-pipeline.service';

@Controller('api/v1/deals')
export class DealController {
  constructor(
    private readonly createDealService: CreateDealService,
    private readonly listDealPipelineService: ListDealPipelineService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@GetUser() user: User, @Body() createDealDto: CreateDealDto) {
    const creatorId = user.id;
    const companyId = user.companyId;

    return this.createDealService.execute({
      creatorId,
      companyId,
      ...createDealDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('pipeline/:pipeline_id')
  async listDealPipeline(
    @GetUser() user: User,
    @Param('pipeline_id') pipelineId: string,
  ) {
    return this.listDealPipelineService.execute({
      pipelineId,
      companyId: user.companyId,
    });
  }
}
