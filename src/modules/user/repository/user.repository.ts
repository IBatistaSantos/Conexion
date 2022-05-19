import { User } from '../entities/user.entity';

export interface UserRepository {
  create(params: CreateUser): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  createUserAndCompany(
    params: CreateUserAndCompany,
  ): Promise<ResponseCreateUserAndCompany>;
}

type CreateUserAndCompany = CreateUser & {
  company: {
    name: string;
  };
};

type CreateUser = {
  name: string;
  email: string;
  password: string;
};

type ResponseCreateUserAndCompany = {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  company: {
    id: string;
    name: string;
  };
};
