import { Module } from '@nestjs/common';
import { PersonController } from './controllers/person.controller';
import { PrismaPersonRepository } from './providers/repos/prisma/person.repository';
import { CreatePersonService } from './services/create-person.service';
import { DeletePersonService } from './services/delete-person.service';
import { DetailsPersonService } from './services/detail-person.service';
import { UpdatePersonService } from './services/update-person.service';

@Module({
  imports: [],
  controllers: [PersonController],
  providers: [
    DetailsPersonService,
    CreatePersonService,
    UpdatePersonService,
    DeletePersonService,
    { provide: 'PersonRepository', useClass: PrismaPersonRepository },
  ],
})
export class PersonModule {}
