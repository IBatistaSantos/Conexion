import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DetailsStageService } from '../../../../modules/stage/services/details-stage.service';
import { VtexRepositorys } from '../repository/vtex-authentication.repository';

type ConnectVtexServiceParams = {
  companyId: string;
  appKey: string;
  appToken: string;
  integrationOrder: boolean;
  integrationProduct: boolean;
  stageId?: string;
};

@Injectable()
export class ConnectVtexService {
  constructor(
    @Inject('VtexRepository')
    private readonly vtexRepository: VtexRepositorys,

    private readonly detailsStageService: DetailsStageService,
  ) {}
  async execute(params: ConnectVtexServiceParams) {
    const {
      companyId,
      appKey,
      appToken,
      integrationOrder,
      integrationProduct,
      stageId,
    } = params;

    const authenticationExists = await this.vtexRepository.findByCompanyId(
      companyId,
    );

    if (authenticationExists) {
      throw new BadRequestException('Vtex already connected');
    }

    if (integrationOrder) {
      await this.detailsStageService.execute({
        companyId,
        stageId: stageId,
      });
    }

    return this.vtexRepository.create({
      companyId,
      appKey,
      appToken,
      integrationOrder,
      integrationProduct,
      stageId,
    });
  }
}
