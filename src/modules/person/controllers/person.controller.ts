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

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { CreatePersonDto } from '../dtos/create-person.dto';
import { UpdatePersonDto } from '../dtos/update-person.dto';
import { CreatePersonService } from '../services/create-person.service';
import { DeletePersonService } from '../services/delete-person.service';
import { DetailsPersonService } from '../services/detail-person.service';
import { UpdatePersonService } from '../services/update-person.service';

@Controller('api/v1/person')
export class PersonController {
  constructor(
    private readonly createPersonService: CreatePersonService,
    private readonly detailsPersonService: DetailsPersonService,
    private readonly updatePersonService: UpdatePersonService,
    private readonly deletePersonService: DeletePersonService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @GetUser() user: User,
    @Body() createPersonDto: CreatePersonDto,
  ) {
    const { name, email, ownerId } = createPersonDto;
    const companyId = user.companyId;
    const userId = user.id;

    return await this.createPersonService.execute({
      name,
      email,
      creatorId: ownerId,
      userId,
      companyId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':person_id')
  async details(@GetUser() user: User, @Param('person_id') personId: string) {
    return this.detailsPersonService.execute({
      personId,
      companyId: user.companyId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':person_id')
  async update(
    @GetUser() user: User,
    @Param('person_id') personId: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    const companyId = user.companyId;
    const userId = user.id;
    return this.updatePersonService.execute({
      companyId,
      userId,
      personId,
      data: updatePersonDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':person_id')
  async delete(@GetUser() user: User, @Param('person_id') personId: string) {
    return this.deletePersonService.execute({
      personId,
      companyId: user.companyId,
    });
  }
}
