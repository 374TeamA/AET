// import React from "react";

import { useEffect, useState } from "react";
import { deleteImport, getImports } from "../../database/imports";
import { Import } from "../../types/transaction";
import { getAllTransactions } from "../../database/transactions";
import { useParams } from "react-router-dom";
interface ImportTotals {
  id: string;
  earliestTransaction: Date;
  latestTransaction: Date;
  importDate: Date;
  transactions: number;
  amount: number;
}
export default function History() {
  const params = useParams();
  const accountId: string | undefined = params.id;
  const [imports, setImports] = useState<Import[]>([]);
  const [importTotals, setImportTotals] = useState<{
    [key: string]: ImportTotals;
  }>({});

  const deleteDBImport = (importId: string) => {
    deleteImport(importId).then(() => {
      delete importTotals[importId];
    });
  };
  useEffect(() => {
    const importTotals: { [key: string]: ImportTotals } = {};
    getImports().then((res) => {
      setImports(res);
    });

    accountId &&
      getAllTransactions(accountId).then((res) => {
        for (let i = 0; i < res.length; i++) {
          const amount = res[i].details.reduce(
            (accumulator: number, detail) => accumulator + detail.amount,
            0
          );
          if (importTotals[res[i].import] == undefined) {
            importTotals[res[i].import] = {
              id: res[i].import,
              earliestTransaction: res[i].date,
              latestTransaction: res[i].date,
              importDate:
                imports.find((importItem) => importItem.id === res[i].import)
                  ?.importDate || new Date(),
              transactions: 1,
              amount: amount
            };
          } else {
            importTotals[res[i].import].transactions += 1;
            importTotals[res[i].import].amount += amount;
            if (res[i].date < importTotals[res[i].import].earliestTransaction) {
              importTotals[res[i].import].earliestTransaction = res[i].date;
            }
            if (res[i].date > importTotals[res[i].import].latestTransaction) {
              importTotals[res[i].import].latestTransaction = res[i].date;
            }
          }
        }
        setImportTotals(importTotals);
      });
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Delete</th>
            <th>Import Date</th>
            <th>Earliest Transaction</th>
            <th>Latest Transaction</th>
            <th>Transactions</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(importTotals).map((importItem) => (
            <tr key={importTotals[importItem].id}>
              <td
                onClick={() => {
                  deleteDBImport(importTotals[importItem].id);
                }}
              >
                X
              </td>
              <td>
                {importTotals[importItem].importDate.toLocaleDateString()}
              </td>
              <td>
                {importTotals[
                  importItem
                ].earliestTransaction.toLocaleDateString()}
              </td>
              <td>
                {importTotals[
                  importItem
                ].latestTransaction.toLocaleDateString()}
              </td>
              <td>{importTotals[importItem].transactions}</td>
              <td>${(importTotals[importItem].amount / 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {Object.keys(importTotals).map((importItem) => (
        <div
          style={{
            display: "flex",
            height: "3rem",
            width: "100%",
            border: "1px solid lightgrey",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          <div
            style={{
              flexGrow: "0.2"
            }}
          >
            <p>X</p>
          </div>
          <div
            style={{
              flexGrow: "1"
            }}
          >
            {importTotals[importItem].importDate.toLocaleDateString()}
          </div>
          <div
            style={{
              flexGrow: "1"
            }}
          >
            {importTotals[importItem].transactions}
          </div>
          <div
            style={{
              flexGrow: "1"
            }}
          >
            ${(importTotals[importItem].amount / 100).toFixed(2)}
          </div>
        </div>
      ))} */}
    </div>
  );
}
