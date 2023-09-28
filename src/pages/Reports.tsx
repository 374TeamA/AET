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

    const recieved = generateGraph();

    graph = new Chart(
      document.getElementById("testGraph") as HTMLCanvasElement,
      recieved
    );
  }

  return (
    <div>
      <p>Reports</p>

    <div className="canvasContainer">
      <canvas id="testGraph"></canvas>
    </div>

      <button onClick={createGraph}>Generate</button>
    </div>
  );
}
