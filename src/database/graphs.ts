import { GraphConfig } from "../types/graph";
import { connectToDatabase } from "./initialisation";

/**
 * Gets all favourited graphs saved to the database.
 *
 * @returns {GraphConfig[]} An array of graphs
 */
export async function getFavouriteGraphs(): Promise<GraphConfig[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Graphs", "readonly");
    const tos = dbt.objectStore("Graphs");
    const ind = tos.index("favourite");
    const req = ind.getAll(IDBKeyRange.only(true));

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
 * Gets all graphs saved to the database.
 *
 * @returns {GraphConfig[]} An array of graphs
 */
export async function getGraphs(): Promise<GraphConfig[]> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Graphs", "readonly");
    const tos = dbt.objectStore("Graphs");
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
 * Saves a graph to the database. If the graph already exists it will be updated.
 *
 * @param g The graph to be saved
 * @returns {boolean} True on success, false on error
 */
export async function saveGraph(g: GraphConfig): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Graphs", "readwrite");
    const tos = dbt.objectStore("Graphs");
    const req = tos.put(g);
    req.onsuccess = () => {
      console.log("Graph added", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}

/**
 * Deletes a graph from the database.
 *
 * @param id The id of the graph to be deleted
 * @returns {boolean} True on success, false on error
 */
export async function deleteGraph(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const dbt = db.transaction("Graphs", "readwrite");
    const tos = dbt.objectStore("Graphs");
    const req = tos.delete(id);
    req.onsuccess = () => {
      console.log("Graph deleted", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}
