import { ChangeEvent, useState } from "react";
import { GraphConfig } from "../types/graph";
import { ChartType } from "chart.js";
import { v4 as uuidv4 } from "uuid";

interface ConfigureGraphProps {
  type: string;
  handleClose: () => void;
  addGraphConfig: (graphConfig: GraphConfig) => void;
}

export default function ConfigureGraph({
  type,
  handleClose,
  addGraphConfig
}: ConfigureGraphProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [allTransactions, setAllTransactions] = useState<boolean>(false);
  const [dynamicUpdate, setDynamicUpdate] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[]>([]);

  const addAccount = () => {
    const selectElement: HTMLSelectElement = document.getElementById(
      "addAccount"
    ) as HTMLSelectElement;

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const account: string = selectedOption.value;

    if (!accounts.includes(account)) {
      setAccounts([...accounts, account]);
    }
  };

  const addAllAccounts = () => {
    const selectElement: HTMLSelectElement = document.getElementById(
      "addAccount"
    ) as HTMLSelectElement;

    let options: HTMLOptionsCollection;

    if (selectElement) {
      options = selectElement.options;
    } else {
      return;
    }

    console.log(options);

    const tempAccounts: string[] = [];

    for (let i = 0; i < options.length; i++) {
      if (!accounts.includes(options[i].value)) {
        console.log(options[i].value);

        tempAccounts.push(options[i].value);
      }
    }

    setAccounts([...accounts, ...tempAccounts]);
    console.log(accounts);
  };

  const deleteAccount = (index: number) => {
    const tempAccounts = [...accounts];
    tempAccounts.splice(index, 1);
    setAccounts(tempAccounts);
  };

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

  // TODO: Fix this to add all not added categories
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

    const tempCategories: string[] = [];

    for (let i = 0; i < options.length; i++) {
      if (!categories.includes(options[i].value)) {
        console.log(options[i].value);

        tempCategories.push(options[i].value);
      }
    }

    setCategories([...categories, ...tempCategories]);
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
    const startDateInput: HTMLInputElement = document.getElementById(
      "startDatePopup"
    ) as HTMLInputElement;
    const endDateInput: HTMLInputElement = document.getElementById(
      "endDatePopup"
    ) as HTMLInputElement;
    const days7Button: HTMLButtonElement = document.getElementById(
      "days7Popup"
    ) as HTMLButtonElement;
    const days14Button: HTMLButtonElement = document.getElementById(
      "days14Popup"
    ) as HTMLButtonElement;
    const days31Button: HTMLButtonElement = document.getElementById(
      "days31Popup"
    ) as HTMLButtonElement;

    if (e.target.checked) {
      setAllTransactions(true);

      startDateInput.disabled = true;
      endDateInput.disabled = true;
      days7Button.disabled = true;
      days14Button.disabled = true;
      days31Button.disabled = true;
    } else {
      setAllTransactions(false);

      startDateInput.disabled = false;
      endDateInput.disabled = false;
      days7Button.disabled = false;
      days14Button.disabled = false;
      days31Button.disabled = false;
    }
  };

  const handleDynamicUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setDynamicUpdate(true);
    } else {
      setDynamicUpdate(false);
    }
  };

  const createGraphConfig = () => {
    // validation checking
    let daysDifference: number;
    let dateStart: Date;
    let dateEnd: Date;

    if (allTransactions) {
      daysDifference = -1;
      dateStart = new Date();
      dateEnd = new Date();
    } else {
      if (!startDate || !endDate) {
        console.log("Error: Missing start or end date");
        return;
      }

      if (startDate > endDate) {
        console.log("Error: Invalid date range");
        return;
      }

      dateStart = new Date(startDate);
      dateEnd = new Date(endDate);

      // Calculate the time difference in milliseconds
      const timeDifference = dateEnd.getTime() - dateStart.getTime();

      // Convert the time difference to days
      daysDifference = timeDifference / (1000 * 3600 * 24);
    }

    if (categories.length === 0) {
      console.log("Error: No category specified");
      return;
    }

    if (accounts.length === 0) {
      console.log("Error: No account specified");
      return;
    }

    const graphConfig: GraphConfig = {
      id: uuidv4(),
      startDate: dateStart,
      endDate: dateEnd,
      length: daysDifference,
      categories: categories,
      type: type as ChartType,
      favourite: false,
      update: dynamicUpdate,
      allTransactions: allTransactions
    };

    console.log(graphConfig);

    addGraphConfig(graphConfig);
    handleClose();
  };

  return (
    <div>
      <h1>Configure {type} Graph</h1>
      <canvas id="configureGraph"></canvas>

      <div id="accountPopupContainer">
        <h1>Select Accounts</h1>
        <select id="addAccount">
          {/* TODO: populate this from database */}
          <option value="Everyday">Everyday</option>
          <option value="Savings">Savings</option>
        </select>
        <button onClick={addAccount}>Add Account</button>
        <button onClick={addAllAccounts}>Add All Accounts</button>
        <ul>
          {accounts.map((item: string, index) => (
            <li key={`account${index}`}>
              {item}
              <button onClick={() => deleteAccount(index)}>remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div id="categoryPopupContainer">
        <h1>Select Categories</h1>
        {/* TODO: Populate this from database */}
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
            <li key={`category${index}`}>
              {item}
              <button onClick={() => deleteCategory(index)}>remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div id="dateRangePopupContainer">
        <h1>Select Date Range</h1>
        <div>
          <label htmlFor="startDatePopup">Start Date:</label>
          <input
            type="date"
            id="startDatePopup"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label htmlFor="endDatePopup">End Date:</label>
          <input
            type="date"
            id="endDatePopup"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        <button
          id="days7Popup"
          onClick={() => {
            handleDays(7);
          }}
        >
          7 Days
        </button>
        <button
          id="days14Popup"
          onClick={() => {
            handleDays(14);
          }}
        >
          14 Days
        </button>
        <button
          id="days31Popup"
          onClick={() => {
            handleDays(31);
          }}
        >
          1 month
        </button>

        <label htmlFor="allTransactionsPopup" className="custom-checkbox">
          All Transactions
          <input
            type="checkbox"
            id="allTransactionsPopup"
            onChange={handleAllTransactionsChange}
          />
          <span className="checkmark"></span>
        </label>

        <label htmlFor="dynamicUpdatePopup" className="custom-checkbox">
          Update graphs automatically
          <input
            type="checkbox"
            id="dynamicUpdatePopup"
            onChange={handleDynamicUpdateChange}
          />
          <span className="checkmark"></span>
        </label>
      </div>
      <button onClick={createGraphConfig}>Add Graph</button>
    </div>
  );
}
