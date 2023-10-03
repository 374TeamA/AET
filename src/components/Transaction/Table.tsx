import React from "react";
import { useState } from "react";
import { Transaction } from "../../types/transaction";
import "./Table.css";
import Column from "./Column";

export default function Table() {
  const [cagegorised, setCategorised] = useState<Transaction[]>([]);
  const [uncategorised, setUncategorised] = useState<Transaction[]>([]);
  return (
    <div className="display-flex">
      <Column title="Categorised" />
      {/* Categorised transactions list */}
      <Column title="Un-categorised" />
      {/* Un-Categorised transactions list */}
    </div>
  );
}
