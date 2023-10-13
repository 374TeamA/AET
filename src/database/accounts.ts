import { Account } from "../types/account";
import { Import } from "../types/transaction";
import { deleteImport, getImportsByAccount } from "./imports";
import { connectToDatabase } from "./initialisation";

/**
 * Gets all accounts saved to the database.
 *
 * @returns {Account[]} An array of accounts
 */
export async function getAccounts(): Promise<Account[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Accounts", "readonly");
    const tos = dbt.objectStore("Accounts");
    const req = tos.getAll();
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
 * Saves an account to the database.
 *
 * @param acc The account to be saved
 * @returns {boolean} True on success, false on error
 */
export async function saveAccount(acc: Account): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Accounts", "readwrite");
    const tos = dbt.objectStore("Accounts");
    const req = tos.put(acc);
    req.onsuccess = () => {
      console.log("Account added", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}

/**
 * Deletes an account and all transactions under that account from the database.
 *
 * @param id The id of the account to be deleted
 * @returns {boolean} True on success, false on error
 */
export async function deleteAccount(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Accounts", "readwrite");
    const tos = dbt.objectStore("Accounts");
    const req = tos.delete(id);
    req.onsuccess = async () => {
      console.log("Account deleted", req.result);

      const impList: Import[] = await getImportsByAccount(id);
      for (const imp of impList) {
        deleteImport(imp.id);
      }

      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}
