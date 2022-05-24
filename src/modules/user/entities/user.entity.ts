export type User = {
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
