// import { Transaction } from "../types/transaction";

export function connectToDatabase(acc: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject("Your browser does not support IndexedDB");
    }

    const req = indexedDB.open("AET", 1);

    req.onerror = () => {
      console.error(`IndexedDB Error: ${req.error}`);
      reject("Error opening database");
    };

    req.onupgradeneeded = () => {
      console.log("DB Created/updated");
      const db = req.result;

      if (!db.objectStoreNames.contains(acc)) {
        const tOS = db.createObjectStore(acc, { keyPath: "id" });
        tOS.createIndex("date", "date", { unique: false });
        tOS.createIndex("merchant", "merchant", { unique: false });
      }
    };

    req.onsuccess = () => {
      console.log("Successful database connection");
      const db = req.result;

      if (!db.objectStoreNames.contains(acc)) {
        const tOS = db.createObjectStore(acc, { keyPath: "id" });
        tOS.createIndex("date", "date", { unique: false });
        tOS.createIndex("merchant", "merchant", { unique: false });
      }

      resolve(db);
    };
  });
}
