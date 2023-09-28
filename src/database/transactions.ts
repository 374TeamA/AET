import { Transaction, Import } from "../types/transaction";
import { connectToDatabase } from "./initialisation";

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
// TODO: nathan will implement

export function getTransactions(
  acctName: String,
  startDate: Date,
  endDate: Date
): Transaction[] {
  // returns an array of transactions
  const db = connectToDatabase();

}

export function saveTransaction(transaction: Transaction) {
  const db = connectToDatabase();
  if (db instanceof IDBDatabase) {
    const dbt = db.transaction("transactions", "readwrite");
    const ts = dbt.objectStore("transactions");
    const req = ts.add(transaction);
    req.onsuccess = () => {
      console.log("Transaction added", req.result);
    }
    req.onerror = () => {
      console.error("Error", req.error)
    }
  }
}
