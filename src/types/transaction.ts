/* Used to track groups of imported transactions */
export type Import = {
  id: string;
  importDate: Date;
  account: string;
};

/* Used to store transaction information */
export type Transaction = {
  id: string;
  account: string;
  import: string;
  hash: string;
  date: Date;
  merchant: string;
  totalAmount: number;
  details: TransactionDetail[];
};
export type TransactionDetail = { amount: number; category: string };

/* Used to split transactions into smaller transactions for graphing */
export type FlattenedTransaction = {
  date: Date;
  merchant: string;
  amount: number;
  category: string;
};
