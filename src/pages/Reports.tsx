// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { useState, ChangeEvent, useEffect } from "react";
import { generateGraph } from "../functions/generateGraph";
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

export default function Reports() {
  useTitle("Reports");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [type, setType] = useState<string>("");

  const createGraph = () => {
    // Get a reference to the select element
    const selectElement: HTMLSelectElement = document.getElementById(
      "typeSelection"
    ) as HTMLSelectElement;

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const type: string = selectedOption.value;

    const recieved = generateGraph(type);

    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const canvasContainer: HTMLDivElement = document.getElementById(
      "canvasContainer"
    ) as HTMLDivElement;
    canvasContainer.appendChild(canvas);

    new Chart(canvas, recieved);
  };

  useEffect(() => {}, [startDate, endDate]);

  const handleExportTransactions = () => {
    throw new Error("Function not implemented.");
  };

  const handleExportGraph = (graphID: string) => {
    const canvas: HTMLCanvasElement = document.getElementById(graphID) as HTMLCanvasElement;
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

  // Handle default Graph Generation
  // let barGraphChart: Chart;
  // let lineGraphChart: Chart;
  // let pieGraphChart: Chart;
  // let polarGraphChart: Chart;

  // const barGraph = () => {
  //   if (barGraphChart) barGraphChart.destroy();

  //   barGraphChart = new Chart(
  //     document.getElementById("barGraph") as HTMLCanvasElement,
  //     defaultBarGrpah()
  //   );
  // };

  // const lineGraph = () => {
  //   if (lineGraphChart) lineGraphChart.destroy();

  //   lineGraphChart = new Chart(
  //     document.getElementById("lineGraph") as HTMLCanvasElement,
  //     defaultLineGraph()
  //   );
  // };

  // const pieGraph = () => {
  //   if (pieGraphChart) pieGraphChart.destroy();

  //   pieGraphChart = new Chart(
  //     document.getElementById("pieGraph") as HTMLCanvasElement,
  //     defaultPieGraph()
  //   );
  // };

  // const polarGraph = () => {
  //   if (polarGraphChart) polarGraphChart.destroy();

  //   polarGraphChart = new Chart(
  //     document.getElementById("polarGraph") as HTMLCanvasElement,
  //     defaultPolarGraph()
  //   );
  // };

  // TODO: Jake this is throwing errors when the popup loads
  // useEffect(() => {
  //   barGraph(), lineGraph(), pieGraph(), polarGraph();
  // });

  //Handle Popup
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  const handleOpenPopup = (e) => {
    setPopupOpen(true);
    setType(e.target.id);
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
        <button onClick={()=>handleExportGraph("pieGraph")}>Export Graph</button>
      </Group>

      {/*TODO: Jake to fix UI*/}
      <Group label="New Graph">
        <div className="canvasContainer">
          <canvas onClick={handleOpenPopup} id="bar"></canvas>
          <canvas onClick={handleOpenPopup} id="line"></canvas>
          <canvas id="pieGraph"></canvas>
          <canvas id="polarGraph"></canvas>
        </div>
      </Group>

      <div>
        <button onClick={handleOpenPopup}>Open Popup</button>
        <CustomPopup isOpen={isPopupOpen} onClose={handleClosePopup}>
          <ConfigureGraph type={type} />
        </CustomPopup>
      </div>

      <select id="typeSelection">
        <option value="pie">Pie</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="polarArea">Polar Area</option>
      </select>

      <button onClick={createGraph}>Generate</button>

      <div className="canvasContainer" id="canvasContainer"></div>
    </div>
  );
}
