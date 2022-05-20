import { SetMetadata } from '@nestjs/common';

export const Company = (companyId: string) =>
  SetMetadata('companyId', companyId);
