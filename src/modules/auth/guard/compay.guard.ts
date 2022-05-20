import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DetailsUserService } from 'src/modules/user/services/details-user.service';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly detailsUserService: DetailsUserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.detailsUserService.execute(request.user.id);
    const companyId = request.body.companyId;
    return user.owner.id === companyId;
  }
}
