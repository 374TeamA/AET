import { Transaction } from "../types/transaction";
import { connectToDatabase } from "./initialisation";

/**
 * Gets all transactions for the account.
 *
 * @param acc The id of the account
 * @returns {Transaction[]} An array of transactions
 */
export async function getAllTransactions(acc: string): Promise<Transaction[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Transactions", "readonly");
    const tos = dbt.objectStore("Transactions");
    const ind = tos.index("account");
    const req = ind.getAll(IDBKeyRange.only(acc));

    req.onsuccess = function () {
      if (req.result !== undefined) {
        resolve(req.result);
      } else {
        reject(false);
      }
    };
  });
}

/**
 * Gets all transactions for the account in between two dates.
 *
 * @param acc The id of the account
 * @param startDate The from date
 * @param endDate The to date
 * @returns {Transaction[]} An array of transactions
 */
export async function getTransactions(
  acc: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Transactions", "readonly");
    const tos = dbt.objectStore("Transactions");
    const ind = tos.index("accdate");
    const req = ind.getAll(IDBKeyRange.bound([acc, startDate], [acc, endDate]));

    req.onsuccess = function () {
      if (req.result !== undefined) {
        resolve(req.result);
      } else {
        reject(false);
      }
    };
  });
}

/**
 * Saves a transaction under an account to the database. If the transaction already exists it will be updated.
 *
 * @param t The transaction to be saved
 * @param acc The account to save the transaction to
 * @returns {boolean} True on success, false on error
 */
export async function saveTransaction(t: Transaction): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Transactions", "readwrite");
    const tos = dbt.objectStore("Transactions");
    const req = tos.put(t);
    req.onsuccess = () => {
      console.log("Transaction added", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}

/**
 * Deletes a transaction from the database.
 *
 * @param id The id of the transaction to be deleted
 * @param acc The account of the transaction to be deleted
 * @returns {boolean} True on success, false on error
 */
export async function deleteTransaction(
  id: string,
  acc: string
): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction(acc, "readwrite");
    const tos = dbt.objectStore(acc);
    const req = tos.delete(id);
    req.onsuccess = () => {
      console.log("Transaction deleted", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}
