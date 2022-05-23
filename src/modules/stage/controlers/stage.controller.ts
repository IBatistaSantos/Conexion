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
      userId: user.id,
      ...createStageDto,
    });
  }

  @Put(':stage_id')
  async update(
    @Body() updateStageDto: UpdateStageDto,
    @Param('stage_id') stageId: string,
  ) {
    return await this.updateStageService.execute({
      stageId,
      updateStage: updateStageDto,
    });
  }

  @Delete(':stage_id')
  async delete(@Param('stage_id') stageId: string) {
    return await this.deleteStageService.execute({ stageId });
  }

  @Delete()
  async deleteBulk(@Query('ids') stageIds: string) {
    return await this.deleteBulkStageService.execute({
      ids: stageIds,
    });
  }

  @Get(':stage_id')
  async get(@Param('stage_id') stageId: string) {
    return await this.detailsStageService.execute({ stageId });
  }
}
