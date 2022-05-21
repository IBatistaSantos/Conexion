export type InviteEmployee = {
  id: string;
  name: string;
  email: string;
  code: string;
  status: StatusInvite;
  company_Id: string;
  created_at: Date;
  updated_at: Date;
};

type StatusInvite = 'PENDING' | 'ACCEPTED' | 'REJECTED';
