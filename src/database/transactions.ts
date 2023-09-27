import { Transaction, Import } from "../types/transaction";

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
// TODO: nathan will implement

export function getTransactions(
  acctName,
  startDate: Date,
  endDate: Date
): Transaction[] {
  // returns an array of transactions
}

export function saveTransaction(transaction: Transaction) {}
