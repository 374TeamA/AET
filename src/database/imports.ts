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
        reject("No imports");
      }
    };
  });
}

/**
 * Saves an import to the database.
 *
 * @param i The import to be saved
 */
export async function saveImport(i: Import) {
  const db = await connectToDatabase();
  const dbt = db.transaction("Imports", "readwrite");
  const tos = dbt.objectStore("Imports");
  const req = tos.put(i);
  req.onsuccess = () => {
    console.log("Import added", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}

/**
 * Deletes an import from the database.
 *
 * @param id The id of the import to be deleted
 */
export async function deleteImport(id: string) {
  const db = await connectToDatabase();
  const dbt = db.transaction("Imports", "readwrite");
  const tos = dbt.objectStore("Imports");
  const req = tos.delete(id);
  req.onsuccess = () => {
    console.log("Import deleted", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}
