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
        reject("No merchants");
      }
    };
  });
}

/**
 * Saves a merchant to the database. If the merchant already exists it will be updated.
 *
 * @param m The merchant to be saved
 */
export async function saveMerchant(m: Merchant) {
  const db = await connectToDatabase();
  const dbt = db.transaction("Merchants", "readwrite");
  const tos = dbt.objectStore("Merchants");
  const req = tos.put(m);
  req.onsuccess = () => {
    console.log("Merchant added", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}

/**
 * Deletes a merchant from the database.
 *
 * @param id The id of the merchant to be deleted
 */
export async function deleteMerchant(id: string) {
  const db = await connectToDatabase();
  const dbt = db.transaction("Merchants", "readwrite");
  const tos = dbt.objectStore("Merchants");
  const req = tos.delete(id);
  req.onsuccess = () => {
    console.log("Merchant deleted", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}
