import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../modules/auth/guard/jwt-auth.guard';
import { User } from '../../../../modules/user/entities/user.entity';
import { GetUser } from '../../../../shared/decorator/get-user.decorator';
import { CreateAuthenticationVtexDto } from '../dtos/create-connect-vtex.dto';
import { ConnectVtexService } from '../services/connect-vtex.service';
import { SyncProductVtexService } from '../services/sync-product-vtex.service';

@Controller('api/v1/integration/vtex')
export class VtexController {
  constructor(
    private readonly connectVtexService: ConnectVtexService,
    private readonly syncProductVtexService: SyncProductVtexService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('/products/sync')
  async syncProducts(@GetUser() user: User) {
    return await this.syncProductVtexService.execute({
      companyId: user.companyId,
    });
  }
}
