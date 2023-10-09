import { Transaction } from "../types/transaction";
import { getAllTransactions } from "../database/transactions";

/**
 * Exports all transactions for an account to a CSV
 *
 * @param acc The id of the account
 */
export async function exportTransactions(acc: string) {
  const tL: Transaction[] = getAllTransactions(acc);
}
