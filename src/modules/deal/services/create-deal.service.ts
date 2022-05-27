import { Inject, Injectable } from '@nestjs/common';
import { DetailsPersonService } from '../../../modules/person/services/detail-person.service';
import { DetailsProductService } from '../../../modules/product/services/details-product.service';
import { DealRepository } from '../repository/deal.repository';

type CreateCreateDealServiceParams = {
  title: string;
  stageId: string;
  creatorId: string;
  userId?: string;
  companyId: string;
  personId?: string;
  productId?: string;
};

@Injectable()
export class CreateDealService {
  constructor(
    @Inject('DealRepository')
    private readonly dealRepository: DealRepository,

    private readonly detailsPersonService: DetailsPersonService,
    private readonly detailsProductService: DetailsProductService,
  ) {}

  async execute(params: CreateCreateDealServiceParams): Promise<any> {
    const {
      title,
      stageId,
      creatorId,
      userId,
      companyId,
      personId,
      productId,
    } = params;

    if (personId) {
      const person = await this.detailsPersonService.execute({
        personId,
        companyId,
      });

      if (person.companyId !== companyId) {
        throw new Error('Person not in company');
      }
    }

    if (productId) {
      const product = await this.detailsProductService.execute({
        productId,
        companyId,
      });

      if (product.companyId !== companyId) {
        throw new Error('Product not in company');
      }
    }

    const stageAvailable = await this.dealRepository.hasStageAvailable({
      companyId,
      stageId,
    });

    if (!stageAvailable) {
      throw new Error('Stage not available');
    }

    const deal = await this.dealRepository.create({
      creator_id: creatorId,
      stageId,
      title,
      userId: userId ?? creatorId,
      personId,
      productId,
    });

    return {
      id: deal.id,
      title: deal.title,
      stage: {
        id: deal.stage.id,
        name: deal.stage.name,
      },
      ...(userId && {
        user: {
          id: deal.user.id,
          name: deal.user.name,
        },
      }),
      ...(personId && {
        person: {
          id: deal.person.id,
          name: deal.person.name,
        },
      }),
      ...(productId && {
        product: {
          id: deal.product.id,
          code: deal.product.code,
          name: deal.product.name,
          prices: {
            id: deal.product.prices.id,
            price: deal.product.prices.price,
            cost: deal.product.prices.cost,
            currency: deal.product.prices.currency,
          },
        },
      }),
    };
  }
}
