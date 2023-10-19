import { useEffect, useState } from "react";
import { Transaction } from "../../types/transaction";
import "./Table.css";
import Column from "./Column";
import { saveTransaction } from "../../database/transactions";
import { Merchant } from "../../types/merchant";
import { saveMerchant } from "../../database/merchants";
interface TableProps {
  transactions: Transaction[] | undefined;
}
export default function Table({ transactions }: TableProps) {
  const [categorised, setCategorised] = useState<Transaction[]>(
    transactions?.filter((transaction) =>
      transaction.details.some(
        (detail) =>
          typeof detail === "object" &&
          (detail as { amount: number; category: string }).category !==
            "Un-Categorised" // id of uncategorised transactions
      )
    ) ?? []
  );
  const [uncategorised, setUncategorised] = useState<Transaction[]>(
    transactions?.filter((transaction) =>
      transaction.details.some(
        (detail) =>
          typeof detail === "object" &&
          (detail as { amount: number; category: string }).category ==
            "Un-Categorised"
      )
    ) ?? []
  );

  useEffect(() => {
    // //save the import to the database
    // //console.log("Saving import to database");
    // if (transactions) {
    //   for (const transaction of transactions) {
    //     saveTransaction(transaction);
    //   }
    // }
    // if (categorised) {
    //   for (const transaction of categorised) {
    //     saveTransaction(transaction);
    //   }
    // }
  }, [categorised, transactions]);

  const updateTransactions = (transaction: Transaction, auto?: boolean) => {
    //remove transaction from uncategorized and add it to categorized
    //console.log(`Updating transaction ${transaction.id}`);
    saveTransaction(transaction);
    const newUncategorized = [...uncategorised];
    const newCategorized = [...categorised];
    if (transaction.details.length == 1 && auto) {
      const newMerchant: Merchant = {
        id: transaction.merchant,
        category: transaction.details[0].category
      };
      saveMerchant(newMerchant);
    }
    const index = newUncategorized.findIndex(
      (item) => item.id === transaction.id
    );
    if (index != -1) {
      newUncategorized.splice(index, 1);
      setUncategorised(newUncategorized);
      newCategorized.push(transaction);
      setCategorised(newCategorized);
    } else {
      const catIndex = newCategorized.findIndex(
        (item) => item.id === transaction.id
      );
      if (catIndex != -1) {
        newCategorized[catIndex] = transaction;
        setCategorised(newCategorized);
      }
    }
  };
  useEffect(() => {
    ////console.log(importData);
  }, []);

  return (
    <div className="display-flex">
      <Column
        title="Categorised"
        items={categorised}
        updateTransactions={updateTransactions}
      />
      {/* Categorised transactions list */}
      <Column
        title="Un-categorised"
        items={uncategorised}
        updateTransactions={updateTransactions}
      />
      {/* Un-Categorised transactions list */}
    </div>
  );
}
