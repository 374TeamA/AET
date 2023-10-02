import { stat } from "fs";
import { Transaction } from "../types/transaction";
import { connectToDatabase } from "./initialisation";

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
// TODO: nathan will implement

export async function getTransactions(
  acc: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> {
  const db = await connectToDatabase(acc);
  return new Promise((resolve, reject) => {
    const dbt = db.transaction(acc, "readonly");
    const tos = dbt.objectStore(acc);
    const ind = tos.index("date");
    const req = ind.getAll(IDBKeyRange.bound(startDate, endDate));

    req.onsuccess = function () {
      if (req.result !== undefined) {
        resolve(req.result);
      } else {
        reject("No transactions");
      }
    };
  });
}

export async function saveTransaction(t: Transaction, acc: string) {
  const db = await connectToDatabase(acc);
  const dbt = db.transaction(acc, "readwrite");
  const tos = dbt.objectStore(acc);
  const req = tos.put(t);
  req.onsuccess = () => {
    console.log("Transaction added", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}

export async function deleteTransaction(id: string, acc: string) {
  const db = await connectToDatabase(acc);
  const dbt = db.transaction(acc, "readwrite");
  const tos = dbt.objectStore(acc);
  const req = tos.delete(id);
  req.onsuccess = () => {
    console.log("Transaction deleted", req.result);
  };
  req.onerror = () => {
    console.error("Error", req.error);
  };
}
