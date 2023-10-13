import { Chart } from "chart.js";
import { getAllTransactions, getTransactions } from "../database/transactions";
import { generateGraph } from "../functions/generateGraph";
import { GraphConfig } from "../types/graph";
import { Transaction, FlattenedTransaction } from "../types/transaction";
import { useEffect, useRef } from "react";

interface NewGraphProps {
  graphConfig: GraphConfig;
  index: number;
  handleDeleteGraph: (index: number) => void;
  handleFavourite: (index: number) => void;
  // props
}

export default function NewGraph({
  handleDeleteGraph,
  graphConfig,
  index,
  handleFavourite
}: NewGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  useEffect(() => {
    let transactions: Transaction[] = [];
    // all transactions regradless of date via account
    // Create an array of Promises for all accounts
    console.log();
    let transactionPromises;
    if (graphConfig.allTransactions) {
      transactionPromises = graphConfig.accounts.map((account) =>
        getAllTransactions(account)
      );
    } else if (graphConfig.update) {
      const today: Date = new Date();
      const cutOffDate: Date = new Date(today.getDate() - graphConfig.length);

      transactionPromises = graphConfig.accounts.map((account) =>
        getTransactions(account, cutOffDate, today)
      );
    } else {
      transactionPromises = graphConfig.accounts.map((account) =>
        getTransactions(account, graphConfig.startDate, graphConfig.endDate)
      );
    }

    // Use Promise.all to wait for all transactions to load
    Promise.all(transactionPromises)
      .then((allTransactions) => {
        console.log(allTransactions);

        // Concatenate all the transactions from different accounts
        transactions = allTransactions.reduce(
          (acc, accountTransactions) => acc.concat(accountTransactions),
          []
        );

        console.log("All Transactions: " + transactions.length);
        console.log(transactions);

        // sort transactions by date (index 0 is oldest, index length-1 is newest)
        transactions.sort((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });

        const flattenedTransactions: FlattenedTransaction[] = [];

        transactions.forEach((transaction) => {
          console.log("transaction");

          transaction.details.forEach((detail) => {
            console.log("detail");

            // Create a FlattenedTransaction for each TransactionDetail
            const flattenedTransaction: FlattenedTransaction = {
              date: transaction.date,
              merchant: transaction.merchant,
              amount: detail.amount,
              category: detail.category
            };

            console.log(flattenedTransaction);

            flattenedTransactions.push(flattenedTransaction);
          });
        });

        console.log("Flattened Transactions: " + flattenedTransactions.length);

        const recieved = generateGraph(flattenedTransactions, graphConfig.type);

        if (canvasRef.current) {
          const canvasEl = canvasRef?.current?.getContext("2d");

          if (Chart.getChart("canvas" + 1) != undefined) {
            Chart.getChart("canvas" + 1)?.destroy();
          }

          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          if (canvasEl) {
            chartInstance.current = new Chart(canvasEl, recieved);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions: " + error);
      });
  }, [graphConfig, index, handleDeleteGraph]);

  return (
    <div className="canvasContainer">
      <h1>New Graph</h1>
      <canvas ref={canvasRef}></canvas>
      <button
        onClick={() => {
          handleDeleteGraph(index);
        }}
      >
        Delete Graph
      </button>
      <button
        onClick={() => {
          handleFavourite(index);
        }}
      >
        {graphConfig.favourite ? "Un-Favourtie" : "Favourtie"}
      </button>
    </div>
  );
}
