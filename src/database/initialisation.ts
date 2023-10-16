/**
 * Connects to the indexedDB database.
 *
 * @returns {IDBDatabase} A database connection
 */
export function connectToDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject("Your browser does not support IndexedDB");
    }

    const req = indexedDB.open("AET", 10);

    req.onerror = () => {
      console.error(`IndexedDB Error: ${req.error}`);
      reject("Error opening database");
    };

    req.onupgradeneeded = () => {
      console.log("DB Created/updated");
      const db = req.result;

      if (!db.objectStoreNames.contains("Transactions")) {
        const tOS = db.createObjectStore("Transactions", { keyPath: "id" });
        tOS.createIndex("account", "account", { unique: false });
        tOS.createIndex("import", "import", { unique: false });
        tOS.createIndex("date", "date", { unique: false });
        tOS.createIndex("merchant", "merchant", { unique: false });
        tOS.createIndex("accdate", ["account", "date"], { unique: false });
        tOS.createIndex("hash", "hash", { unique: false });
        tOS.createIndex("acchash", ["account", "hash"], { unique: false });
      }

      if (!db.objectStoreNames.contains("Categories")) {
        const tOS = db.createObjectStore("Categories", { keyPath: "id" });
        tOS.createIndex("name", "name", { unique: true });
      }

      if (!db.objectStoreNames.contains("Merchants")) {
        const tOS = db.createObjectStore("Merchants", { keyPath: "id" });
        tOS.createIndex("category", "category", { unique: false });
      }

      if (!db.objectStoreNames.contains("Accounts")) {
        const tOS = db.createObjectStore("Accounts", { keyPath: "id" });
        tOS.createIndex("name", "name", { unique: true });
      }

      if (!db.objectStoreNames.contains("Imports")) {
        const tOS = db.createObjectStore("Imports", { keyPath: "id" });
        tOS.createIndex("importDate", "importDate", { unique: false });
        tOS.createIndex("account", "account", { unique: false });
      }

      if (!db.objectStoreNames.contains("Graphs")) {
        const tOS = db.createObjectStore("Graphs", { keyPath: "id" });
        tOS.createIndex("favourite", "favourite", { unique: false });
      }
    };

    req.onsuccess = () => {
      console.log("Successful database connection");
      const db = req.result;
      resolve(db);
    };
  });
}
