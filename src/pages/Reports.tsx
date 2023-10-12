// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { useState, ChangeEvent, useEffect, MouseEvent, createRef } from "react";
// import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";
import Group from "../components/Group";
import { useTitle } from "../hooks/UseTitle";
import CustomPopup from "../components/Popup";
import {
  defaultBarGraph,
  defaultLineGraph,
  defaultPieGraph,
  defaultPolarGraph
} from "../functions/defaultGraph";
//import CustomPopup from "../components/Popup";
import ConfigureGraph from "../components/GraphConfiguration";
import { GraphConfig } from "../types/graph";
import { getGraphs, saveGraph } from "../database/graphs";
import { FlattenedTransaction, Transaction } from "../types/transaction";
import { getAllTransactions } from "../database/transactions";
import { generateGraph } from "../functions/generateGraph";
// import { GraphConfig } from "../types/graph";

/**
 * Report component. Includes all reporting/exporting aspects
 * @returns Reports component
 */
export default function Reports() {
  useTitle("Reports");

  // Variables
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [graphConfigs, setGraphConfigs] = useState<GraphConfig[]>([]);
  const [canvasCount, setCanvasCount] = useState<number>(0);
  const allCanvasContainer = createRef<HTMLDivElement>();

  // const createGraph = () => {
  //   // Get a reference to the select element
  //   const selectElement: HTMLSelectElement = document.getElementById(
  //     "typeSelection"
  //   ) as HTMLSelectElement;

  //   // Get the selected option
  //   const selectedOption = selectElement.options[selectElement.selectedIndex];

  //   // Get the value of the selected option
  //   const type: string = selectedOption.value;

  //   const recieved = generateGraph(type);

  //   const canvas: HTMLCanvasElement = document.createElement("canvas");
  //   const canvasContainer: HTMLDivElement = document.getElementById(
  //     "canvasContainer"
  //   ) as HTMLDivElement;
  //   canvasContainer.appendChild(canvas);
  //   setCanvases([...canvases, canvas]);
  //   new Chart(canvas, recieved);
  // };

  // Adding New Graphs -----------------------------------------------------------------------------------------------------
  /**
   * Adds a graph configuration to the array of graph configurations.
   *
   * @param {GraphConfig} graphConfig - The configuration to add.
   */
  const addGraphConfig = (graphConfig: GraphConfig) => {
    // Add the provided graph configuration to the existing array.
    setGraphConfigs([...graphConfigs, graphConfig]);
    saveGraph(graphConfig);
  };

  // TODO: fix this
  const handleGenerateGraphs = () => {
    // Render graphs
    for (let i = 0; i < graphConfigs.length; i++) {
      console.log(
        "Canvas Count: " +
          canvasCount +
          "\ni: " +
          i +
          "\nGraph Config Count: " +
          graphConfigs.length
      );

      // if (i < canvasCount) {
      //   console.log("skipping");
      //   continue;
      // }

      setCanvasCount((canvasCount) => canvasCount + 1);

      console.log("running");

      if (graphConfigs[i].allTransactions) {
        let transactions: Transaction[] = [];
        // all transactions regradless of date via account
        // Create an array of Promises for all accounts
        const transactionPromises = graphConfigs[i].accounts.map((account) =>
          getAllTransactions(account)
        );

        // Use Promise.all to wait for all transactions to load
        Promise.all(transactionPromises)
          .then((allTransactions) => {
            // Concatenate all the transactions from different accounts
            transactions = allTransactions.reduce(
              (acc, accountTransactions) => acc.concat(accountTransactions),
              []
            );

            console.log("All Transactions: " + transactions.length);
            console.log(transactions);

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

            console.log(
              "Flattened Transactions: " + flattenedTransactions.length
            );
            console.log(flattenedTransactions.map((t) => t));

            //const specificCategoryTransactions: FlattenedTransaction[] = [];

            // remove a transaction if it is not in any of the categories provided
            // flattenedTransactions.forEach(
            //   (transaction: FlattenedTransaction) => {
            //     console.log(1);
            //   }
            // );

            const recieved = generateGraph(
              flattenedTransactions,
              graphConfigs[i].type
            );

            console.log("Generating Canvas");

            const canvas: HTMLCanvasElement = document.createElement("canvas");
            canvas.id = "canvas" + i;
            const canvasContainer: HTMLDivElement = document.getElementById(
              "canvasContainerAll"
            ) as HTMLDivElement;
            canvasContainer.appendChild(canvas);
            new Chart(canvas, recieved);
          })
          .catch((error) => {
            console.error("Error fetching transactions: " + error);
          });
      }
    }
  };

  /**
   * React hook that triggers an effect when the component mounts
   * This is fine
   */
  useEffect(() => {
    // Handle adding new graph configurations
    getGraphs().then((graphs) => {
      setGraphConfigs([...graphs]);
    });

    console.log("done");
  }, []);

  // Exporting Functionality -----------------------------------------------------------------------------------------------
  /**
   * React hook that triggers an effect when `startDate` or `endDate` changes.
   */
  useEffect(() => {}, [startDate, endDate]);

  /**
   * Placeholder function for exporting transactions.
   */
  const handleExportTransactions = () => {
    throw new Error("Function not implemented.");
  };

  /**
   * Exports a graph as a PNG image.
   *
   * @param {string} graphID - The ID of the HTML canvas element containing the graph.
   */
  const handleExportGraph = (graphID: string) => {
    const canvas: HTMLCanvasElement = document.getElementById(
      graphID
    ) as HTMLCanvasElement;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "graph.png";
    link.href = dataURL;
    link.click();
  };

  /**
   * Event handler for changes in the start date input field.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event from the input field.
   */
  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setStartDate(newDate);
  };

  /**
   * Event handler for changes in the end date input field.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event from the input field.
   */
  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setEndDate(newDate);
  };

  /**
   * Sets the start and end dates based on a given number of days from today.
   *
   * @param {number} days - The number of days to go back from today.
   */
  const handleDays = (days: number) => {
    const today: Date = new Date();
    const startDate: Date = new Date();
    startDate.setDate(today.getDate() - days);
    setStartDate(startDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  /**
   * Use effect to initialize the charts when the component mounts.
   */
  useEffect(() => {
    // Handle default bar graph generation
    if (Chart.getChart("bar") != undefined) {
      Chart.getChart("bar")?.destroy();
    }

    new Chart(
      document.getElementById("bar") as HTMLCanvasElement,
      defaultBarGraph()
    );

    // Handle default line graph generation
    if (Chart.getChart("line") != undefined) {
      Chart.getChart("line")?.destroy();
    }

    new Chart(
      document.getElementById("line") as HTMLCanvasElement,
      defaultLineGraph()
    );

    // Handle default pie graph generation
    if (Chart.getChart("pie") != undefined) {
      Chart.getChart("pie")?.destroy();
    }

    new Chart(
      document.getElementById("pie") as HTMLCanvasElement,
      defaultPieGraph()
    );

    // Handle default polar area graph generation
    if (Chart.getChart("polarArea") != undefined) {
      Chart.getChart("polarArea")?.destroy();
    }

    new Chart(
      document.getElementById("polarArea") as HTMLCanvasElement,
      defaultPolarGraph()
    );
  }, []);

  //Handle Popup ------------------------------------------------------------------------------------------------------------------
  /**
   * Represents the state of whether a popup is open or not.
   * @type {boolean} status of the popup. True is open, False is closed
   */
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  /**
   * Handles opening a popup and setting its type.
   *
   * @param {MouseEvent<HTMLCanvasElement>} e - The click event that triggered the popup.
   */
  const handleOpenPopup = (e: MouseEvent<HTMLCanvasElement>) => {
    setPopupOpen(true);
    setType(e.currentTarget.id);
  };

  /**
   * Handles closing the currently open popup.
   */
  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div id="reports-container" className="content">
      <Group label="Export">
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        <button
          onClick={() => {
            handleDays(7);
          }}
        >
          7 Days
        </button>
        <button
          onClick={() => {
            handleDays(14);
          }}
        >
          14 Days
        </button>
        <button
          onClick={() => {
            handleDays(31);
          }}
        >
          1 month
        </button>
        <label htmlFor="allTransactions" className="custom-checkbox">
          All Transactions
          <input type="checkbox" id="allTransactions" />
          <span className="checkmark"></span>
        </label>
        <button onClick={handleExportTransactions}>Export CSV</button>
        <button onClick={() => handleExportGraph("pieGraph")}>
          Export Graph
        </button>
      </Group>

      {/*TODO: Jake to fix UI*/}
      <div id="newGraphContainer">
        <div className="canvasContainer">
          <canvas onClick={handleOpenPopup} id="bar"></canvas>
          <canvas onClick={handleOpenPopup} id="line"></canvas>
          <canvas onClick={handleOpenPopup} id="pie"></canvas>
          <canvas onClick={handleOpenPopup} id="polarArea"></canvas>
        </div>
      </div>

      {/* Popup to handle configuration of new graph */}
      <div id="configureGraphPopupContainer">
        <CustomPopup isOpen={isPopupOpen} onClose={handleClosePopup}>
          <ConfigureGraph
            type={type}
            handleClose={handleClosePopup}
            addGraphConfig={addGraphConfig}
          />
        </CustomPopup>
      </div>

      <div
        ref={allCanvasContainer}
        id="canvasContainerAll"
        className="canvasContainer"
      >
        <button onClick={handleGenerateGraphs}>Generate Graphs</button>
      </div>
    </div>
  );
}
