import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../modules/auth/guard/jwt-auth.guard';
import { User } from '../../../../modules/user/entities/user.entity';
import { GetUser } from '../../../../shared/decorator/get-user.decorator';
import { CreateAuthenticationVtexDto } from '../dtos/create-connect-vtex.dto';
import { ConnectVtexService } from '../services/connect-vtex.service';

@Controller('api/v1/integration/vtex')
export class VtexController {
  constructor(private readonly connectVtexService: ConnectVtexService) {}

  @UseGuards(JwtAuthGuard)
  @Post('connect')
  async connect(
    @GetUser() user: User,
    @Body() params: CreateAuthenticationVtexDto,
  ) {
    return this.connectVtexService.execute({
      companyId: user.companyId,
      appKey: params.appKey,
      appToken: params.appToken,
      integrationOrder: params.integrationOrder,
      integrationProduct: params.integrationProduct,
    });
  }
}
