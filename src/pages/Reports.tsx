// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";

export default function Reports() {
  const createGraph = () => {
    const recieved = generateGraph();

    new Chart(
      document.getElementById("testGraph") as HTMLCanvasElement,
      recieved
    );

    new Chart(document.getElementById("testGraph2") as HTMLCanvasElement, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div>
      <p>Reports</p>

      <canvas id="testGraph"></canvas>
      <canvas id="testGraph2"></canvas>

      <button onClick={createGraph}>Generate</button>
    </div>
  );
}
