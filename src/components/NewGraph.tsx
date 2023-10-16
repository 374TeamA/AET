import { Chart } from "chart.js";
import { getAllTransactions, getTransactions } from "../database/transactions";
import { generateGraph } from "../functions/generateGraph";
import { GraphConfig } from "../types/graph";
import { Transaction, FlattenedTransaction } from "../types/transaction";
import { useEffect, useRef } from "react";
import CustomButton from "./CustomButton";

interface NewGraphProps {
  graphConfig: GraphConfig;
  index: number;
  handleDeleteGraph: (index: number) => void;
  handleFavourite: (index: number) => void;
}

/**
 * New Graph Component which has a graph
 *
 * @export NewGraph component
 * @param {NewGraphProps} {
 *   handleDeleteGraph,
 *   graphConfig,
 *   index,
 *   handleFavourite
 * }
 */
export default function NewGraph({
  handleDeleteGraph,
  graphConfig,
  index,
  handleFavourite
}: NewGraphProps) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  /**
   * When the component mounts, fetch all transactions and generate the graph
   */
  useEffect(() => {
    // Create an empty array of transactions
    let transactions: Transaction[] = [];

    // Create an array of Promises for all accounts
    let transactionPromises: Promise<Transaction[]>[];

    // Create the needed promises for the number of transaction database calls needed
    if (graphConfig.allTransactions) {
      // Get all transactions regardless of date for all specified accounts
      transactionPromises = graphConfig.accounts.map((account) =>
        getAllTransactions(account)
      );
    } else if (graphConfig.update) {
      // Get all transactions from the last specified number of days for all specified accounts
      const today: Date = new Date();
      const cutOffDate: Date = new Date(today.getDate() - graphConfig.length);

      transactionPromises = graphConfig.accounts.map((account) =>
        getTransactions(account, cutOffDate, today)
      );
    } else {
      // Get all transactions between start and end date for all specified accounts
      transactionPromises = graphConfig.accounts.map((account) =>
        getTransactions(account, graphConfig.startDate, graphConfig.endDate)
      );
    }

    // Use Promise.all to wait for all transactions to load
    Promise.all(transactionPromises)
      .then((allTransactions) => {
        // Concatenate all the transactions from different accounts
        transactions = allTransactions.reduce(
          (acc, accountTransactions) => acc.concat(accountTransactions),
          []
        );

        // sort transactions by date (index 0 is oldest, index length-1 is newest)
        transactions.sort((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });

        const flattenedTransactions: FlattenedTransaction[] = [];

        // Convert every Transaction object into a FlattendedTransaction object
        transactions.forEach((transaction) => {
          transaction.details.forEach((detail) => {
            // Create a FlattenedTransaction for each TransactionDetail
            const flattenedTransaction: FlattenedTransaction = {
              date: transaction.date,
              merchant: transaction.merchant,
              amount: detail.amount,
              category: detail.category
            };

            flattenedTransactions.push(flattenedTransaction);
          });
        });

        // Get the Chart.js configuration object using the specified graph config and list of transactions
        const recieved = generateGraph(flattenedTransactions, graphConfig);

        // If the canvas exists, create a new chart instance
        if (canvasRef.current) {
          const canvasEl = canvasRef?.current?.getContext("2d");

          if (Chart.getChart("canvas" + index) != undefined) {
            Chart.getChart("canvas" + index)?.destroy();
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
        // Log the error
        console.error("Error fetching transactions: " + error);
      });
  }, [graphConfig, index, handleDeleteGraph]);

  return (
    <div>
      {/* <h1>New Graph</h1> */}

      {/* Graph */}
      <canvas
        style={{ minHeight: "20rem" }}
        id={`canvas${index}`}
        ref={canvasRef}
      ></canvas>

      {/* Delete Graph Button */}
      <CustomButton
        onClick={() => {
          handleDeleteGraph(index);
        }}
      >
        Delete Graph
      </CustomButton>

      {/* Favourite Graph Button */}
      <CustomButton
        onClick={() => {
          handleFavourite(index);
        }}
      >
        {graphConfig.favourite ? "Un-Favourtie" : "Favourtie"}
      </CustomButton>
    </div>
  );
}
