import { Transaction } from "../types/transaction";

export function connectToDatabase(): IDBDatabase | undefined {
  // return a database connection
  if (!indexedDBSupport()) {
    throw new Error("Your browser does not support IndexedDB");
  }

  const req = indexedDB.open("AET", 1);

  req.onerror = () => {
    console.error(`IndexedDB Error: ${req.error}`);
  }

  req.onupgradeneeded = () => {
    console.log("DB Created/updated")
    const db = req.result;

    if (!db.objectStoreNames.contains("transactions")) {
      const tOS = db.createObjectStore("transactions", {keyPath: "id"});
      tOS.createIndex("date", "date", {unique: false});
      tOS.createIndex("merchant", "merchant", {unique: false});
    }
  }

  req.onsuccess = () => {
    console.log("Successful database connection");
    const db = req.result;

    db.onversionchange = () => {
      db.close();
      alert("Database is outdated, please reload the page.")
    };

    const t: Transaction = {
      id: "01",
      date: new Date("2023/09/29"),
      merchant: "Warehouse",
      details: [{
        amount: 23,
        category: "Clothing"
      }]
    };

    const dbt = db.transaction("transactions", "readwrite");
    const ts = dbt.objectStore("transactions");
    const requ = ts.add(t);
    requ.onsuccess = () => {
      console.log("Transaction added", req.result);
    }
    requ.onerror = () => {
      console.error("Error", req.error)
    }

    return db;
  }

  return undefined;
}

function indexedDBSupport(){
  return 'indexedDB' in window;
}