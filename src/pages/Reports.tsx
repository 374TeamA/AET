// import React from 'react'
// TODO: Makayla will create some react components to generate charts from an array of transactions
import Chart from "chart.js/auto";
import { useState, useEffect, MouseEvent } from "react";
// import { generateGraph } from "../functions/generateGraph";
import "../styles/reports.css";
import { useTitle } from "../hooks/UseTitle";
import CustomPopup from "../components/Popup";
import {
  defaultBarGraph,
  defaultLineGraph,
  defaultPieGraph,
  defaultPolarGraph
} from "../functions/defaultGraph";
import ConfigureGraph from "../components/GraphConfiguration";
import { GraphConfig } from "../types/graph";
import { deleteGraph, getGraphs, saveGraph } from "../database/graphs";
import NewGraph from "../components/NewGraph";

/**
 * Report component. Includes all reporting/exporting aspects
 * @returns Reports component
 */
export default function Reports() {
  useTitle("Reports");

  // Variables
  const [type, setType] = useState<string>("");
  const [graphConfigs, setGraphConfigs] = useState<GraphConfig[]>([]);

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

  const handleDeleteGraph = (index: number) => {
    const newConfigs = [...graphConfigs];
    const removed = newConfigs.splice(index, 1);
    setGraphConfigs(newConfigs);
    deleteGraph(removed[0].id);
  };

  const handleFavouriteGraph = (index: number) => {
    const newConfigs = graphConfigs;
    newConfigs[index].favourite = !newConfigs[index].favourite;
    setGraphConfigs([...newConfigs]);
    saveGraph(newConfigs[index]);
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
  }, []);

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

  // Return ------------------------------------------------------------------------------------------------------------------------
  return (
    <div id="reports-container" className="content">
      {/*TODO: Jake to fix UI*/}
      <div id="newGraphSelector" className="canvasContainer">
        <canvas onClick={handleOpenPopup} id="bar"></canvas>
        <canvas onClick={handleOpenPopup} id="line"></canvas>
        <canvas onClick={handleOpenPopup} id="pie"></canvas>
        <canvas onClick={handleOpenPopup} id="polarArea"></canvas>
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

      <div id="canvasContainerAll" className="canvasContainer">
        {graphConfigs.map((config, index) => (
          <NewGraph
            key={JSON.stringify(graphConfigs[index])}
            graphConfig={config}
            index={index}
            handleDeleteGraph={handleDeleteGraph}
            handleFavourite={handleFavouriteGraph}
          />
        ))}
      </div>
    </div>
  );
}
