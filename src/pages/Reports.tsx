// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";

export default function Reports() {
  let graph:Chart;

  const createGraph = () => {
    if(graph){
      graph.destroy();
    }

    // Get a reference to the select element
    const selectElement: HTMLSelectElement = document.getElementById("typeSelection") as HTMLSelectElement;

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const type: string = selectedOption.value;

    const recieved = generateGraph(type);

    graph = new Chart(
      document.getElementById("testGraph") as HTMLCanvasElement,
      recieved
    );
  }

  return (
    <div>
      <p>Reports</p>

      <select id="typeSelection">
        <option value="pie">Pie</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="polarArea">Polar Area</option>
      </select>

      <button onClick={createGraph}>Generate</button>

      <div className="canvasContainer">
        <canvas id="testGraph"></canvas>
      </div>

    </div>
  );
}
