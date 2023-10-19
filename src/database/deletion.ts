/**
 * Deletes the database.
 *
 * @returns {boolean} True on success, false on error
 */
export function deleteDatabase(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase("AET");
    req.onsuccess = () => {
      //console.log("Database deleted", req.result);
      resolve(true);
    };
    req.onerror = () => {
      console.error("Error", req.error);
      reject(false);
    };
  });
}
