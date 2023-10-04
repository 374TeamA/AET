/* Used to track groups of imported transactions */
export type Import = {
  id: string;
  importDate: Date;
  transactions: Transaction[];
};

/* Used to store transaction information */
export type Transaction = {
  id: string;
  importId: string;
  account: string;
  date: Date;
  merchant: string;
  details: { amount: number; category: string }[];
};

/* Used to split transactions into smaller transactions for graphing */
export type FlattenedTransaction = {
  date: Date;
  merchant: string;
  amount: number;
  category: string;
};

export type Category = {
  id: string;
};

export type Merchant = {
  id: string;
  category: string;
};

export type Account = {
  id: string;
};
