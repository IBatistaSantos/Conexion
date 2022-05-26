import { Module } from '@nestjs/common';
import { VtexController } from './controllers/vtex.controller';
import { PrismaVtexRepository } from './providers/repos/prisma/vtex.repository';
import { ConnectVtexService } from './services/connect-vtex.service';

@Module({
  imports: [],
  providers: [
    ConnectVtexService,
    { provide: 'VtexRepository', useClass: PrismaVtexRepository },
  ],
  exports: [],
  controllers: [VtexController],
})
export class VtexModule {}
