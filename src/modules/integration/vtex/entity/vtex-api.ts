import { HttpService } from '@nestjs/axios';

type QueryFindOrderVtex = {
  since: string;
  today: string;
  page: number;
  perPage: number;
};
export class VtexApi {
  constructor(
    private readonly appKey: string,
    private readonly appToken: string,
    private httpService: HttpService,
  ) {}

  async getProducts(_from: number, _to: number): Promise<any> {
    const urlProduct = `${this.getBaseUrl(
      this.appKey,
    )}catalog_system/pvt/products/GetProductAndSkuIds`;

    const productsVtex = await this.httpService
      .get(urlProduct, {
        headers: {
          'Content-Type': 'application/json',
          'X-VTEX-API-AppKey': this.appKey,
          'X-VTEX-API-AppToken': this.appToken,
        },
        params: {
          _from,
          _to,
        },
      })
      .toPromise();

    const { data, range } = productsVtex.data;

    return {
      data: { data: Array(Object.keys(data)).flat(), range },
      status: productsVtex.status,
      success: productsVtex.status === 200,
    };
  }

  async getOrders(params: QueryFindOrderVtex): Promise<any> {
    try {
      const { since, today, page, perPage } = params;
      const urlOrders = `${this.getBaseUrl(this.appKey)}oms/pvt/orders`;

      const ordersVtex = await this.httpService
        .get(urlOrders, {
          headers: {
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': this.appKey,
            'X-VTEX-API-AppToken': this.appToken,
          },
          params: {
            f_creationDate: `creationDate:[${since} TO ${today}]`,
            page,
            per_page: perPage,
          },
        })
        .toPromise();

      return {
        data: ordersVtex.data,
        status: ordersVtex.status,
        success: ordersVtex.status === 200,
      };
    } catch (error) {}
  }

  async getOrderById(orderId: string): Promise<any> {
    try {
      const urlOrders = `${this.getBaseUrl(
        this.appKey,
      )}oms/pvt/orders/${orderId}`;

      const ordersVtex = await this.httpService
        .get(urlOrders, {
          headers: {
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': this.appKey,
            'X-VTEX-API-AppToken': this.appToken,
          },
        })
        .toPromise();

      return {
        data: ordersVtex.data,
        status: ordersVtex.status,
        success: ordersVtex.status === 200,
      };
    } catch (error) {}
  }
  async getProductAndSkuByProductId(productId: string): Promise<any> {
    try {
      const urlProduct = `${this.getBaseUrl(
        this.appKey,
      )}catalog_system/pub/products/variations/${productId}`;

      const productsVtex = await this.httpService
        .get(urlProduct, {
          headers: {
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': this.appKey,
            'X-VTEX-API-AppToken': this.appToken,
          },
        })
        .toPromise();

      return {
        data: productsVtex.data,
        status: productsVtex.status,
        success: productsVtex.status === 200,
      };
    } catch (error) {
      const { response } = error;

      return {
        data: error.data,
        status: response.status,
        success: response.status === 200,
      };
    }
  }

  async getProductById(productId: string): Promise<any> {
    try {
      const urlProduct = `${this.getBaseUrl(
        this.appKey,
      )}catalog/pvt/product/${productId}`;

      const productsVtex = await this.httpService
        .get(urlProduct, {
          headers: {
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': this.appKey,
            'X-VTEX-API-AppToken': this.appToken,
          },
        })
        .toPromise();

      return {
        data: productsVtex.data,
        status: productsVtex.status,
        success: productsVtex.status === 200,
      };
    } catch (error) {
      return {
        data: error.data,
        success: true,
      };
    }
  }

  async getCategoryById(categoryId: string): Promise<any> {
    try {
      const urlProduct = `${this.getBaseUrl(
        this.appKey,
      )}catalog/pvt/category/${categoryId}`;

      const productsVtex = await this.httpService
        .get(urlProduct, {
          headers: {
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': this.appKey,
            'X-VTEX-API-AppToken': this.appToken,
          },
        })
        .toPromise();

      return {
        data: productsVtex.data,
        status: productsVtex.status,
        success: productsVtex.status === 200,
      };
    } catch (error) {
      const { response } = error;

      return {
        data: error.data,
        status: response.status,
        success: response.status === 200,
      };
    }
  }

  async getPriceBySkuId(skuId: string): Promise<any> {
    try {
      const urlProduct = `${this.getPriceBaseUrl(this.appKey)}prices/${skuId}`;

      const productsVtex = await this.httpService
        .get(urlProduct, {
          headers: {
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': this.appKey,
            'X-VTEX-API-AppToken': this.appToken,
          },
        })
        .toPromise();

      return {
        data: productsVtex.data,
        status: productsVtex.status,
        success: productsVtex.status === 200,
      };
    } catch (error) {
      const { response } = error;

      return {
        data: error.data,
        status: response.status,
        success: response.status === 200,
      };
    }
  }
  private getBaseUrl(appKey: string): string {
    const [, accountName] = appKey.split('-');
    return `https://${accountName}.vtexcommercestable.com.br/api/`;
  }

  private getPriceBaseUrl(appKey: string): string {
    const [, accountName] = appKey.split('-');
    return `https://${accountName}.vtexcommercestable.com.br/api/pricing/`;
  }
}
