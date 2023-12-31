import { Category } from "../types/category";
import { connectToDatabase } from "./initialisation";

/**
 * Gets all categories saved to the database.
 *
 * @returns {Category[]} An array of categories
 */
export async function getCategories(): Promise<Category[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Categories", "readonly");
    const tos = dbt.objectStore("Categories");
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
 * Saves a category to the database. If the category already exists it will be updated.
 *
 * @param c The category to be saved
 * @returns {boolean} True on success, false on error
 */
export async function saveCategory(c: Category): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Categories", "readwrite");
    const tos = dbt.objectStore("Categories");
    const req = tos.put(c);
    req.onsuccess = () => {
      //console.log("Category added", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}

/**
 * Deletes a category from the database.
 *
 * @param id The id of the category to be deleted
 * @returns {boolean} True on success, false on error
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Categories", "readwrite");
    const tos = dbt.objectStore("Categories");
    const req = tos.delete(id);
    req.onsuccess = () => {
      //console.log("Category deleted", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}
