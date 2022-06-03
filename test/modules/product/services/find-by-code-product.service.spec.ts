import { ProductRepository } from '../../../../src/modules/product/repository/product.repository';

import { FindByCodeProductService } from '../../../../src/modules/product/services/find-by-code.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

describe('FindByCodeProductService', () => {
  let service: FindByCodeProductService;
  let productRepository: MockProxy<ProductRepository>;

  const product = {
    id: 'any-id',
    code: 'any_code',
    companyId: 'any_companyId',
    name: 'any_product_name',
    description: 'any_description',
    prices: {
      price: Number(10),
      currency: 'BRA',
      cost: Number(5),
    },
    category: 'any_category',
  };

  beforeAll(() => {
    productRepository = mock();

    productRepository.findByCode.mockResolvedValue(product);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByCodeProductService,
        { provide: 'ProductRepository', useValue: productRepository },
      ],
    }).compile();

    service = module.get<FindByCodeProductService>(FindByCodeProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll with correct parameters', async () => {
    await service.execute({
      companyId: 'any_companyId',
      code: 'any_code',
    });

    expect(productRepository.findByCode).toHaveBeenCalledWith({
      code: 'any_code',
      companyId: 'any_companyId',
    });
    expect(productRepository.findByCode).toHaveBeenCalledTimes(1);
  });

  it('should returns false if product not found', async () => {
    productRepository.findByCode.mockResolvedValueOnce(null);

    const result = await service.execute({
      companyId: 'any_companyId',
      code: 'any_code',
    });

    expect(result).toBeFalsy();
  });

  it('should returns an product on success', async () => {
    const result = await service.execute({
      companyId: 'any_companyId',
      code: 'any_code',
    });

    expect(result).toEqual(product);
  });
});
