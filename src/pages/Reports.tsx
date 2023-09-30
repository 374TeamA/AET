// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";
import Group from "../components/Group";

export default function Reports() {
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

  return (
    <div className="padding-2">
      <p>Reports</p>
      <Group label="Export">
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" />
        </div>
        <button>7 Days</button>
        <button>14 Days</button>
        <button>1 month</button>
        <label htmlFor="allTransactions" className="custom-checkbox">
          All Transactions
          <input type="checkbox" id="allTransactions" />
          <span className="checkmark"></span>
        </label>
        <button>Export CSV</button>
        <button>Export Graph</button>
      </Group>

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
