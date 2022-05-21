import { Body, Controller, Post } from '@nestjs/common';

import { CreateCompanyDto } from '../dtos/create-company';
import { CreateCompanyService } from '../services/create-company.service';

@Controller('api/v1/company')
export class CompanyController {
  constructor(private readonly createCompanyService: CreateCompanyService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyService.execute(createCompanyDto);
  }
}
