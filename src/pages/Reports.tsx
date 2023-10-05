// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { useState, ChangeEvent, useEffect } from "react";
// import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";
import Group from "../components/Group";
import { useTitle } from "../hooks/UseTitle";
import {
  defaultBarGraph,
  defaultLineGraph,
  defaultPieGraph,
  defaultPolarGraph
} from "../functions/defaultGraph";
import CustomPopup from "../components/Popup";
import ConfigureGraph from "../components/GraphConfiguration";
import { GraphConfig } from "../types/graph";
// import { GraphConfig } from "../types/graph";

/**
 * Report component. Includes all reporting/exporting aspects
 * @returns Reports component
 */
export default function Reports() {
  useTitle("Reports");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [graphConfigs, setGraphConfigs] = useState<GraphConfig[]>([]);
  // const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([]);

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
  };

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

  // Handle default Graph Generation -----------------------------------------------------------------------------------------
  /**
   * Represents a Bar Graph Chart.
   * @type {Chart}
   */
  let barGraphChart: Chart;

  /**
   * Represents a Line Graph Chart.
   * @type {Chart}
   */
  let lineGraphChart: Chart;

  /**
   * Represents a Pie Graph Chart.
   * @type {Chart}
   */
  let pieGraphChart: Chart;

  /**
   * Represents a Polar Area Graph Chart.
   * @type {Chart}
   */
  let polarGraphChart: Chart;

  /**
   * Initializes and updates the Bar Graph.
   */
  const barGraph = () => {
    if (barGraphChart) return;

    barGraphChart = new Chart(
      document.getElementById("bar") as HTMLCanvasElement,
      defaultBarGraph()
    );
  };

  /**
   * Initializes and updates the Line Graph.
   */
  const lineGraph = () => {
    if (lineGraphChart) return;

    lineGraphChart = new Chart(
      document.getElementById("line") as HTMLCanvasElement,
      defaultLineGraph()
    );
  };

  /**
   * Initializes and updates the Pie Graph.
   */
  const pieGraph = () => {
    if (pieGraphChart) return;

    pieGraphChart = new Chart(
      document.getElementById("pie") as HTMLCanvasElement,
      defaultPieGraph()
    );
  };

  /**
   * Initializes and updates the Polar Area Graph.
   */
  const polarGraph = () => {
    if (polarGraphChart) return;

    polarGraphChart = new Chart(
      document.getElementById("polarArea") as HTMLCanvasElement,
      defaultPolarGraph()
    );
  };

  // TODO: Jake this is throwing errors (sometimes)
  /**
   * Use effect to initialize the charts when the component mounts.
   */
  useEffect(() => {
    barGraph();
    lineGraph();
    pieGraph();
    polarGraph();
  }, []);

  //Handle Popup ------------------------------------------------------------------------------------------------------------------
  /**
   * Represents the state of whether a popup is open or not.
   * @type {boolean}
   */
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  /**
   * Handles opening a popup and setting its type.
   *
   * @param {React.MouseEvent<HTMLCanvasElement>} e - The click event that triggered the popup.
   */
  const handleOpenPopup = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
    <div id="reports-container">
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
    </div>
  );
}
