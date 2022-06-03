import { ProductRepository } from '../../../../src/modules/product/repository/product.repository';

import { FindAllProductService } from '../../../../src/modules/product/services/find-all-product.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

describe('FindAllProductService', () => {
  let service: FindAllProductService;
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

    productRepository.findAll.mockResolvedValue([product]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllProductService,
        { provide: 'ProductRepository', useValue: productRepository },
      ],
    }).compile();

    service = module.get<FindAllProductService>(FindAllProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll with correct parameters', async () => {
    await service.execute({
      companyId: 'any_companyId',
    });

    expect(productRepository.findAll).toHaveBeenCalledWith('any_companyId');
    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should returns an products on success', async () => {
    const result = await service.execute({
      companyId: 'any_companyId',
    });

    expect(result).toEqual([product]);
    expect(result).toHaveLength(1);
  });
});
