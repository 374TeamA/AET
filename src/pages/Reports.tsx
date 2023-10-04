// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { useState, ChangeEvent, useEffect } from "react";
// import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";
import Group from "../components/Group";
import { useTitle } from "../hooks/UseTitle";
import {
  defaultBarGrpah,
  defaultLineGraph,
  defaultPieGraph,
  defaultPolarGraph
} from "../functions/defaultGraph";
import CustomPopup from "../components/Popup";
import ConfigureGraph from "../components/GraphConfiguration";
import { GraphConfig } from "../types/graph";
// import { GraphConfig } from "../types/graph";

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

  const addGraphConfig = (graphConfig: GraphConfig) => {
    setGraphConfigs([...graphConfigs, graphConfig]);
  };

  useEffect(() => {}, [startDate, endDate]);

  const handleExportTransactions = () => {
    throw new Error("Function not implemented.");
  };

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

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setStartDate(newDate);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setEndDate(newDate);
  };

  const handleDays = (days: number) => {
    const today: Date = new Date();
    const startDate: Date = new Date();
    startDate.setDate(today.getDate() - days);
    setStartDate(startDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  // Handle default Graph Generation -----------------------------------------------------------------------------------------
  let barGraphChart: Chart;
  let lineGraphChart: Chart;
  let pieGraphChart: Chart;
  let polarGraphChart: Chart;

  const barGraph = () => {
    if (barGraphChart) barGraphChart.destroy();

    barGraphChart = new Chart(
      document.getElementById("bar") as HTMLCanvasElement,
      defaultBarGrpah()
    );
  };

  const lineGraph = () => {
    if (lineGraphChart) lineGraphChart.destroy();

    lineGraphChart = new Chart(
      document.getElementById("line") as HTMLCanvasElement,
      defaultLineGraph()
    );
  };

  const pieGraph = () => {
    if (pieGraphChart) pieGraphChart.destroy();

    pieGraphChart = new Chart(
      document.getElementById("pie") as HTMLCanvasElement,
      defaultPieGraph()
    );
  };

  const polarGraph = () => {
    if (polarGraphChart) polarGraphChart.destroy();

    polarGraphChart = new Chart(
      document.getElementById("polarArea") as HTMLCanvasElement,
      defaultPolarGraph()
    );
  };

  // TODO: Jake this is throwing errors when the popup loads
  useEffect(() => {
    barGraph();
    lineGraph();
    pieGraph();
    polarGraph();
  }, []);

  //Handle Popup ------------------------------------------------------------------------------------------------------------------
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  const handleOpenPopup = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setPopupOpen(true);
    setType(e.currentTarget.id);
  };

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
      <Group label="New Graph">
        <div className="canvasContainer">
          <canvas onClick={handleOpenPopup} id="bar"></canvas>
          <canvas onClick={handleOpenPopup} id="line"></canvas>
          <canvas onClick={handleOpenPopup} id="pie"></canvas>
          <canvas onClick={handleOpenPopup} id="polarArea"></canvas>
        </div>
      </Group>

      <div>
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
