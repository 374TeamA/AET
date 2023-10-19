import { useState } from "react";
import { Transaction } from "../../types/transaction";
import "./Table.css";
import Column from "./Column";
import { saveTransaction } from "../../database/transactions";
import { Merchant } from "../../types/merchant";
import { saveMerchant } from "../../database/merchants";
interface TableProps {
  transactions: Transaction[] | undefined;
}

/**
 * Table component, displays the transactions in two columns, categorised and uncategorised
 *
 * @export
 * @param {TableProps} { transactions }
 * @return {*}
 */
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

  /**
   * Updates a transaction in the table & database
   * if Auto is true, will also save the category and merchant combo in the database for auto categorization later
   * @param {Transaction} transaction transaction to save/change
   * @param {boolean} [auto] if true, will save the category and merchant combo in the database for auto categorization later
   */
  const updateTransactions = (transaction: Transaction, auto?: boolean) => {
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
