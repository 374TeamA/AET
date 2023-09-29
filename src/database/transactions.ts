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

export async function saveTransaction(t: Transaction) {
  const db = await connectToDatabase();
  const dbt = db.transaction("transactions", "readwrite");
  const ts = dbt.objectStore("transactions");
  const req = ts.put(t);
  req.onsuccess = () => {
    console.log("Transaction added", req.result);
  }
  req.onerror = () => {
    console.error("Error", req.error);
  }
}

export async function deleteTransaction(id: string) {
  const db = await connectToDatabase();
  const dbt = db.transaction("transactions", "readwrite");
  const ts = dbt.objectStore("transactions");
  const req = ts.delete(id);
  req.onsuccess = () => {
    console.log("Transaction deleted", req.result);
  }
  req.onerror = () => {
    console.error("Error", req.error);
  }
}