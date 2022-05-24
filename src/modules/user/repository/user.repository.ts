export interface UserRepository {
  create(params: CreateUser): Promise<CreateUserResult>;
  findByEmail(email: string): Promise<CreateUserResult | undefined>;
  findById(id: string): Promise<CreateUserResult | undefined>;
  createUserAndCompany(
    params: CreateUserAndCompany,
  ): Promise<ResponseCreateUserAndCompany>;

  update({
    name,
    email,
    password,
    userId,
  }: UpdateUser): Promise<CreateUserResult>;
}

export type CreateUserResult = {
  id: string;
  name: string;
  email: string;
  password: string;
  owner?: {
    id: string;
    name: string;
  };
  employees?: {
    id: string;
    company: {
      id: string;
      name: string;
    };
  };
};

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
