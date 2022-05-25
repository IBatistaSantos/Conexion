import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProductService } from '../services/create-product.service';
import { DetailsProductService } from '../services/details-product.service';

@Controller('api/v1/products')
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly detailsProductService: DetailsProductService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @GetUser() user: User,
    @Body() productDto: CreateProductDto,
  ): Promise<any> {
    return this.createProductService.execute({
      category: productDto.category,
      code: productDto.code,
      description: productDto.description,
      name: productDto.name,
      prices: productDto.prices,
      companyId: user.companyId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':productId')
  async findById(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ): Promise<any> {
    return this.detailsProductService.execute({
      productId,
      companyId: user.companyId,
    });
  }
}
