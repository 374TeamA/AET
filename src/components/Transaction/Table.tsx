import React from "react";
import { useState } from "react";
import { Transaction } from "../../types/transaction";
import "./Table.css";
import Column from "./Column";

export default function Table() {
  const [cagegorized, setCategorized] = useState<Transaction[]>([]);
  const [uncategorized, setUncategorized] = useState<Transaction[]>([]);
  return (
    <div className="display-flex">
      <Column title="Categorized" />
      {/* Categorized transactions list */}
      <Column title="Un-categorized" />
      {/* Un-Categorized transactions list */}
    </div>
  );
}
