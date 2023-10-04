import { Account } from "../types/account";
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
        reject("No categories");
      }
    };
  });
}

/**
 * Saves an account to the database.
 *
 * @param acc The account to be saved
 */
export async function saveAccount(acc: Account) {
  const db = await connectToDatabase();
  const dbt = db.transaction("Accounts", "readwrite");
  const tos = dbt.objectStore("Accounts");
  const req = tos.put(acc);
  req.onsuccess = () => {
    console.log("Account added", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}

/**
 * Deletes an account and all transactions under that account from the database.
 *
 * @param id The id of the account to be deleted
 */
export async function deleteAccount(id: string) {
  const db = await connectToDatabase();
  const dbt = db.transaction("Accounts", "readwrite");
  const tos = dbt.objectStore("Accounts");
  const req = tos.delete(id);
  req.onsuccess = () => {
    console.log("Account deleted", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}
