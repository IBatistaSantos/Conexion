import { ProductRepository } from '../../../../src/modules/product/repository/product.repository';

import { DetailsProductService } from '../../../../src/modules/product/services/details-product.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('DetailsProductService', () => {
  let service: DetailsProductService;
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

    productRepository.findById.mockResolvedValue(product);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailsProductService,
        { provide: 'ProductRepository', useValue: productRepository },
      ],
    }).compile();

    service = module.get<DetailsProductService>(DetailsProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findById with correct parameters', async () => {
    await service.execute({
      companyId: 'any_companyId',
      productId: 'any_productId',
    });

    expect(productRepository.findById).toHaveBeenCalledWith('any_productId');
    expect(productRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw error if product not found', async () => {
    productRepository.findById.mockResolvedValueOnce(null);

    const promise = service.execute({
      productId: 'any_productId',
      companyId: 'any_companyId',
    });

    await expect(promise).rejects.toThrow(
      new NotFoundException('Product not found'),
    );
  });

  it('should throw error if product not have a company', async () => {
    const promise = service.execute({
      productId: 'any_productId',
      companyId: 'other_companyId',
    });

    await expect(promise).rejects.toThrow(
      new UnauthorizedException(
        'You are not authorized to access this product',
      ),
    );
  });

  it('should returns an product on success', async () => {
    const result = await service.execute({
      companyId: 'any_companyId',
      productId: 'any_productId',
    });

    expect(result).toEqual(product);
  });
});
