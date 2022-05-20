import { User } from '../entities/user.entity';

export interface UserRepository {
  create(params: CreateUser): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  createUserAndCompany(
    params: CreateUserAndCompany,
  ): Promise<ResponseCreateUserAndCompany>;

  update({ name, email, password, userId }: UpdateUser): Promise<User>;
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

type UpdateUser = {
  name?: string;
  email?: string;
  password?: string;
  userId: string;
};
