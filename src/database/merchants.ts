import { Merchant } from "../types/merchant";
import { connectToDatabase } from "./initialisation";

/**
 * Gets all merchants saved to the database.
 *
 * @returns {Merchant[]} An array of merchants
 */
export async function getMerchants(): Promise<Merchant[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Merchants", "readonly");
    const tos = dbt.objectStore("Merchants");
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
 * Gets all merchants saved to the database.
 *
 * @param m The id of the merchant
 * @returns {Merchant[]} An array of merchants
 */
export async function getMerchant(id: string): Promise<Merchant[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Merchants", "readonly");
    const tos = dbt.objectStore("Merchants");
    const req = tos.getAll(id);

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
 * Saves a merchant to the database. If the merchant already exists it will be updated.
 *
 * @param m The merchant to be saved
 * @returns {boolean} True on success, false on error
 */
export async function saveMerchant(m: Merchant): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Merchants", "readwrite");
    const tos = dbt.objectStore("Merchants");
    const req = tos.put(m);
    req.onsuccess = () => {
      console.log("Merchant added", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}

/**
 * Deletes a merchant from the database.
 *
 * @param id The id of the merchant to be deleted
 * @returns {boolean} True on success, false on error
 */
export async function deleteMerchant(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Merchants", "readwrite");
    const tos = dbt.objectStore("Merchants");
    const req = tos.delete(id);
    req.onsuccess = () => {
      console.log("Merchant deleted", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}
