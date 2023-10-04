import { Import } from "../types/transaction";
import { connectToDatabase } from "./initialisation";

/**
 * Gets all imports saved to the database.
 *
 * @returns {Import[]} An array of imports
 */
export async function getImports(): Promise<Import[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Imports", "readonly");
    const tos = dbt.objectStore("Imports");
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
 * Saves an import to the database.
 *
 * @param i The import to be saved
 * @returns {boolean} True on success, false on error
 */
export async function saveImport(i: Import): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Imports", "readwrite");
    const tos = dbt.objectStore("Imports");
    const req = tos.put(i);
    req.onsuccess = () => {
      console.log("Import added", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}

/**
 * Deletes an import from the database.
 *
 * @param id The id of the import to be deleted
 * @returns {boolean} True on success, false on error
 */
export async function deleteImport(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Imports", "readwrite");
    const tos = dbt.objectStore("Imports");
    const req = tos.delete(id);
    req.onsuccess = () => {
      console.log("Import deleted", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}
