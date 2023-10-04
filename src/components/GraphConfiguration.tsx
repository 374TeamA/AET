import { ChangeEvent, useState } from "react";
import Group from "./Group";
import { GraphConfig } from "../types/graph";
import { ChartType } from "chart.js";

interface ConfigureGraphProps {
  type: string;
}

export default function ConfigureGraph({ type }: ConfigureGraphProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const addCategory = () => {
    const selectElement: HTMLSelectElement = document.getElementById(
      "addCategories"
    ) as HTMLSelectElement;

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const category: string = selectedOption.value;

    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // TODO: Fix this to add all none added categories
  const addAllCategories = () => {
    const selectElement: HTMLSelectElement = document.getElementById(
      "addCategories"
    ) as HTMLSelectElement;

    let options: HTMLOptionsCollection;

    if (selectElement) {
      options = selectElement.options;
    } else {
      return;
    }

    console.log(options);

    for (let i = 0; i < options.length; i++) {
      console.log(options[i].value);

      if (!categories.includes(options[i].value)) {
        console.log(options[i].value);

        setCategories([...categories, options[i].value]);
      }
    }

    console.log(categories);
  };

  const deleteCategory = (index: number) => {
    const tempCategories = [...categories];
    tempCategories.splice(index, 1);
    setCategories(tempCategories);
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

  const handleAllTransactionsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      console.log(e.target.checked);
    } else {
    }
  };

  const createGraphConfig = () => {
    // validation checking
    if (!startDate || !endDate) {
      console.log("Error: Missing start or end date");
      return;
    }

    if (startDate > endDate) {
      console.log("Error: Invalid date range");
      return;
    }

    if (categories.length === 0) {
      console.log("Error: No category specified");
      return;
    }

    const dateStart: Date = new Date(startDate);
    const dateEnd: Date = new Date(endDate);

    // Calculate the time difference in milliseconds
    const timeDifference = dateEnd.getTime() - dateStart.getTime();

    // Convert the time difference to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    const graphConfig: GraphConfig = {
      startDate: dateStart,
      endDate: dateEnd,
      length: daysDifference,
      categories: categories,
      type: type as ChartType,
      favourite: false,
      update: false
    };

    console.log(graphConfig);
  };

  return (
    <div>
      <h1>Configure {type} Graph</h1>
      <canvas id="configureGraph"></canvas>
      <Group label="Category">
        <select id="addCategories">
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Housing">Housing</option>
        </select>
        <button onClick={addCategory}>Add Category</button>
        <button onClick={addAllCategories}>Add All Categories</button>
        <ul>
          {categories.map((item: string, index) => (
            <li key={index}>
              {item}
              <button onClick={() => deleteCategory(index)}>remove</button>
            </li>
          ))}
        </ul>
      </Group>

      <div>
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

        <label htmlFor="allTransactions2" className="custom-checkbox">
          All Transactions
          <input
            type="checkbox"
            id="allTransactions2"
            onChange={handleAllTransactionsChange}
          />
          <span className="checkmark"></span>
        </label>

        <label htmlFor="dynamicUpdate" className="custom-checkbox">
          Update graphs automatically
          <input type="checkbox" id="dynamicUpdate" />
          <span className="checkmark"></span>
        </label>
      </div>
      <button onClick={createGraphConfig}>Add Graph</button>
    </div>
  );
}
