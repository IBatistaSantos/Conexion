export interface PriceRepository {
  create(params: CreatePriceParams): Promise<any>;
}

export type CreatePriceParams = {
  productId: string;
  cost: number;
  currency: string;
  price: number;
};
