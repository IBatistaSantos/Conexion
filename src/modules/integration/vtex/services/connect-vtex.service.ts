import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { VtexRepositorys } from '../repository/vtex-authentication.repository';

type ConnectVtexServiceParams = {
  companyId: string;
  appKey: string;
  appToken: string;
  integrationOrder: boolean;
  integrationProduct: boolean;
};

@Injectable()
export class ConnectVtexService {
  constructor(
    @Inject('VtexRepository')
    private readonly vtexRepository: VtexRepositorys,
  ) {}
  async execute(params: ConnectVtexServiceParams) {
    const {
      companyId,
      appKey,
      appToken,
      integrationOrder,
      integrationProduct,
    } = params;

    const authenticationExists = await this.vtexRepository.findByCompanyId(
      companyId,
    );

    if (authenticationExists) {
      throw new BadRequestException('Vtex already connected');
    }

    return this.vtexRepository.create({
      companyId,
      appKey,
      appToken,
      integrationOrder,
      integrationProduct,
    });
  }
}
