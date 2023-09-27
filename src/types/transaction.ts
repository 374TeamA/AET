export type Import = {
  id: string;
  importDate: Date;
  transactions: Transaction[];
};

export type Transaction = {
  id: string; // uuid
  date: Date;
  merchant: string;
  details: { amount: number; category: string }[];
};

export type FlattenedTransaction = {
  date: Date;
  merchant: string;
  amount: number;
  category: string;
};
