import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { CreateStageDto } from '../dtos/create-stage.dto';
import { UpdateStageDto } from '../dtos/update-stage.dto';
import { CreateStageService } from '../services/create-stage.service';
import { DeleteBulkStageService } from '../services/delete-multi-stage.service';
import { DeleteStageService } from '../services/delete-stage.service';
import { DetailsStageService } from '../services/details-stage.service';
import { UpdateStageService } from '../services/update-stage.service';

@Controller('api/v1/stages')
export class StageController {
  constructor(
    private readonly createStagesService: CreateStageService,
    private readonly updateStageService: UpdateStageService,
    private readonly deleteStageService: DeleteStageService,
    private readonly deleteBulkStageService: DeleteBulkStageService,
    private readonly detailsStageService: DetailsStageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@GetUser() user: User, @Body() createStageDto: CreateStageDto) {
    return this.createStagesService.execute({
      companyId: user.companyId,
      ...createStageDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':stage_id')
  async update(
    @GetUser() user: User,
    @Body() updateStageDto: UpdateStageDto,
    @Param('stage_id') stageId: string,
  ) {
    return await this.updateStageService.execute({
      stageId,
      updateStage: updateStageDto,
      companyId: user.companyId,
    });
  }

  @Delete(':stage_id')
  @UseGuards(JwtAuthGuard)
  async delete(@GetUser() user: User, @Param('stage_id') stageId: string) {
    return await this.deleteStageService.execute({
      stageId,
      companyId: user.companyId,
    });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteBulk(@GetUser() user: User, @Query('ids') stageIds: string) {
    return await this.deleteBulkStageService.execute({
      ids: stageIds,
      companyId: user.companyId,
    });
  }

  @Get(':stage_id')
  @UseGuards(JwtAuthGuard)
  async get(@GetUser() user: User, @Param('stage_id') stageId: string) {
    return await this.detailsStageService.execute({
      stageId,
      companyId: user.companyId,
    });
  }
}
