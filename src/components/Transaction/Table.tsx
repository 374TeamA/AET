import { useState } from "react";
import { Import, Transaction } from "../../types/transaction";
import "./Table.css";
import Column from "./Column";

interface TableProps {
  importData: Import | undefined;
}
export default function Table({ importData }: TableProps) {
  const categorised: Transaction[] =
    importData?.transactions?.filter((transaction) =>
      transaction.details.some(
        (detail) =>
          typeof detail === "object" &&
          (detail as { amount: number; category: string }).category !==
            "Default"
      )
    ) ?? [];
  const uncategorised: Transaction[] =
    importData?.transactions?.filter((transaction) =>
      transaction.details.some(
        (detail) =>
          typeof detail === "object" &&
          (detail as { amount: number; category: string }).category ===
            "Default"
      )
    ) ?? [];
  return (
    <div className="display-flex">
      <Column title="Categorised" items={categorised} />
      {/* Categorised transactions list */}
      <Column title="Un-categorised" items={uncategorised} />
      {/* Un-Categorised transactions list */}
    </div>
  );
}
