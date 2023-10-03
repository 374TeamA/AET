// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { useState, ChangeEvent, useEffect } from "react";
import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";
import Group from "../components/Group";
import { useTitle } from "../hooks/UseTitle";
import { Button } from "@mui/material";
import CustomPopup from "../components/Popup";
export default function Reports() {
  useTitle("Reports");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const handleExportGraph = () => {
    throw new Error("Function not implemented.");
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

  const handlePopup = () => {
    setIsOpen(!isOpen);
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
        <button onClick={handleExportGraph}>Export Graph</button>
      </Group>
      <CustomPopup isOpen={isOpen} onClose={handlePopup}>
        <div style={{ width: "50vw", display: "flex" }}>
          <div
            style={{
              border: "1px solid lightgrey",
              borderRadius: "5px",
              width: "30vw",
              height: "30vh",
              margin: "0.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Canvas showing Graph Here
          </div>
          <div
            style={{
              height: "100%",
              border: "1px solid lightgrey",
              flex: "1",
              margin: "0.5rem",
              padding: "0.5rem"
            }}
          >
            <div>
              <select>
                <option>Category 1</option>
                <option>Category 1</option>
                <option>Category 1</option>
                <option>Category 1</option>
              </select>
              <button>Add</button>
            </div>
            <div>
              <p
                style={{
                  padding: "0.5rem",
                  backgroundColor: "lightblue",
                  margin: "0.5rem"
                }}
              >
                Selected Category
              </p>
            </div>
          </div>
        </div>
      </CustomPopup>
      <select id="typeSelection">
        <option value="pie">Pie</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="polarArea">Polar Area</option>
      </select>

      <button onClick={createGraph}>Generate</button>
      <Button
        onClick={() => {
          handlePopup();
        }}
      >
        Details
      </Button>

      <div className="canvasContainer" id="canvasContainer"></div>
    </div>
  );
}
