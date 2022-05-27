export type Deal = {
  id: string;
  title: string;
  stageId: string;
  creator_id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  stage: {
    id: string;
    name: string;
    pipelineId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    name: string;
    id: string;
  };
  person: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    code: string;
    name: string;
    prices: {
      id: string;
      price: number;
      currency: string;
      cost: number;
    };
  };
};
