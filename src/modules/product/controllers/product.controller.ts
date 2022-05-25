import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProductService } from '../services/create-product.service';

@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly createProductService: CreateProductService) {}

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
}
