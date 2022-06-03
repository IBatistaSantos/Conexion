import { ProductRepository } from '../../../../src/modules/product/repository/product.repository';
import { PriceRepository } from '../../../../src/modules/product/repository/price.repository';

import { CreateProductService } from '../../../../src/modules/product/services/create-product.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

describe('CreateProductService', () => {
  let service: CreateProductService;
  let productRepository: MockProxy<ProductRepository>;
  let priceRepository: MockProxy<PriceRepository>;

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
    priceRepository = mock();

    productRepository.findByCode.mockResolvedValue(null);
    productRepository.create.mockResolvedValue(product);
    priceRepository.create.mockResolvedValue(product.prices);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductService,
        { provide: 'ProductRepository', useValue: productRepository },
        { provide: 'PriceRepository', useValue: priceRepository },
      ],
    }).compile();

    service = module.get<CreateProductService>(CreateProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findByCode with correct parameters', async () => {
    await service.execute({
      ...product,
    });

    expect(productRepository.findByCode).toHaveBeenCalledWith({
      code: product.code,
      companyId: product.companyId,
    });
    expect(productRepository.findByCode).toHaveBeenCalledTimes(1);
  });

  it('should throw error if product code already exists', async () => {
    productRepository.findByCode.mockResolvedValueOnce(product);

    const promise = service.execute({ ...product });

    await expect(promise).rejects.toThrow(
      new BadRequestException(
        `Product with code ${product.code} already exists`,
      ),
    );
  });

  it('should call create with correct parameters', async () => {
    await service.execute({
      ...product,
    });

    expect(productRepository.create).toHaveBeenCalledWith({
      name: product.name,
      code: product.code,
      description: product.description,
      category: product.category,
      companyId: product.companyId,
    });
    expect(productRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return product on success', async () => {
    const result = await service.execute({
      ...product,
    });

    expect(result).toEqual(product);
  });

  it('should call create price with correct parameters', async () => {
    await service.execute({
      ...product,
    });

    expect(priceRepository.create).toHaveBeenCalledWith({
      productId: product.id,
      cost: product.prices.cost,
      currency: product.prices.currency,
      price: product.prices.price,
    });
    expect(priceRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return product with prices on success', async () => {
    const result = await service.execute({
      ...product,
    });

    expect(result).toEqual(product);
  });
});
