import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';

import { DealRepository } from '../../../../src/modules/deal/repository/deal.repository';
import { CreateDealService } from '../../../../src/modules/deal/services/create-deal.service';

import { DetailsPersonService } from '../../../../src/modules/person/services/detail-person.service';
import { DetailsProductService } from '../../../../src/modules/product/services/details-product.service';

describe('CreateDealService', () => {
  let service: CreateDealService;

  let dealRepository: MockProxy<DealRepository>;
  let detailsPersonService: MockProxy<DetailsPersonService>;
  let detailsProductService: MockProxy<DetailsProductService>;

  const deal = {
    id: 'any_id',
    title: 'any_title',
    stageId: 'any_stage_id',
    userId: 'any_user_id',
    creator_id: 'any_creator_id',
    stage: {
      id: 'any_stage_id',
      name: 'any_stage_name',
      pipelineId: 'any_pipeline_id',
    },
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  };

  const person = {
    id: 'any_id',
    name: 'any_name',
    companyId: 'any_company_id',
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  };

  const product = {
    id: 'any_id',
    name: 'any_name',
    companyId: 'any_company_id',
    createdAt: new Date(2020, 1, 1),
    updatedAt: new Date(2020, 1, 1),
  };

  beforeAll(() => {
    dealRepository = mock();
    detailsPersonService = mock();
    detailsProductService = mock();

    dealRepository.hasStageAvailable.mockResolvedValue(true);
    dealRepository.create.mockResolvedValue(deal);

    detailsPersonService.execute.mockResolvedValue(person);
    detailsProductService.execute.mockResolvedValue(product);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDealService,
        { provide: 'DealRepository', useValue: dealRepository },
        { provide: DetailsPersonService, useValue: detailsPersonService },
        { provide: DetailsProductService, useValue: detailsProductService },
      ],
    }).compile();

    service = module.get<CreateDealService>(CreateDealService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if DetailsPersonService return company different', async () => {
    const otherCompanyId = 'any_other_company_id';
    const promise = service.execute({
      title: 'any_title',
      stageId: 'any_stage_id',
      creatorId: 'any_creator_id',
      companyId: otherCompanyId,
      personId: 'any_person_id',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException('Person not in company'),
    );
  });

  it('should throw an error if DetailsProductService return company different', async () => {
    const otherCompanyId = 'any_other_company_id';
    const promise = service.execute({
      title: 'any_title',
      stageId: 'any_stage_id',
      creatorId: 'any_creator_id',
      companyId: otherCompanyId,
      productId: 'any_product_id',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException('Product not in company'),
    );
  });

  it('should throw an error if stage not available', async () => {
    dealRepository.hasStageAvailable.mockResolvedValueOnce(false);
    const promise = service.execute({
      title: 'any_title',
      stageId: 'any_stage_id',
      creatorId: 'any_creator_id',
      companyId: 'any_company_id',
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException('Stage not available'),
    );
  });

  /*  it('should call Create with correct parameters', async () => {
    await service.execute({
      name: 'any_company_name',
      owner: {
        name: 'any_owner_name',
        email: 'any_owner_email',
        password: 'any_owner_password',
      },
    });

    expect(dealRepository.create).toBeCalledWith({
      name: 'any_company_name',
      ownerId: user.id,
    });
    expect(dealRepository.create).toHaveBeenCalledTimes(1);
  });
  */

  it('should returns an deal on success', async () => {
    const result = await service.execute({
      title: 'any_title',
      stageId: 'any_stage_id',
      creatorId: 'any_creator_id',
      companyId: 'any_company_id',
    });

    expect(result).toEqual({
      id: deal.id,
      title: deal.title,
      stage: {
        id: deal.stage.id,
        name: deal.stage.name,
      },
    });
  });
});
