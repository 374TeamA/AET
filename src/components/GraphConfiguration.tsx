// Import statements
import { ChangeEvent, useState } from "react";
import { GraphConfig } from "../types/graph";
import { ChartType } from "chart.js";
import { v4 as uuidv4 } from "uuid";
import { Account } from "../types/account";
import { Category } from "../types/category";
import { AccountContext, defaultAccounts } from "../context/AccountsContext";
import { CategoryContext, defaultCategories } from "../context/CategoryContext";

/**
 * Props for configuring the graph.
 */
interface ConfigureGraphProps {
  type: string;
  handleClose: () => void;
  addGraphConfig: (graphConfig: GraphConfig) => void;
}

/**
 * Component for configuring the graph.
 */
export default function ConfigureGraph({
  type,
  handleClose,
  addGraphConfig
}: ConfigureGraphProps) {
  // State for selected categories, start date, end date, and other options
  const [categories, setCategories] = useState<Category[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [allTransactions, setAllTransactions] = useState<boolean>(false);
  const [dynamicUpdate, setDynamicUpdate] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [lengthOfDays, setLengthOfDays] = useState<number>(-1);
  const [databaseAccounts] = useState<Account[]>(defaultAccounts);
  const [databaseCategories] = useState<Category[]>(defaultCategories);
  const [lengthValue, setLengthValue] = useState(1);

  // Fetch accounts and categories from the database when the component mounts
  // useEffect(() => {
  //   const accountPromise: Promise<Account[]> = getAccounts();
  //   accountPromise.then((accounts) => {
  //     const dbAccounts = accounts.map((account) => account.name);
  //     setDatabaseAccount(dbAccounts);
  //   });

  //   const categoryPromise: Promise<Category[]> = getCategories();
  //   categoryPromise.then((categories) => {
  //     const dbCategories = categories.map((category) => category.name);
  //     setDatabaseCategories(dbCategories);
  //   });
  // }, []);

  /**
   * Function to add a selected account to the list of accounts
   */
  const addAccount = () => {
    const selectElement: HTMLSelectElement = document.getElementById(
      "addAccount"
    ) as HTMLSelectElement;

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const account: Account = {
      id: selectedOption.value,
      name: selectedOption.text
    };

    if (!accounts.includes(account)) {
      setAccounts([...accounts, account]);
    }
  };

  // TODO: fix this
  /**
   * Function to add all unadded accounts to the list of accounts
   */
  const addAllAccounts = () => {
    setAccounts([...accounts, ...databaseAccounts]);
  };

  /**
   * Function to delete an account from the list of accounts
   *
   * @param {number} index index of account to delete
   */
  const deleteAccount = (index: number) => {
    const tempAccounts = [...accounts];
    tempAccounts.splice(index, 1);
    setAccounts(tempAccounts);
  };

  /**
   * Function to add a selected category to the list of categories
   */
  const addCategory = () => {
    const selectElement: HTMLSelectElement = document.getElementById(
      "addCategories"
    ) as HTMLSelectElement;

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const category: Category = {
      id: selectedOption.value,
      name: selectedOption.text
    };

    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  /**
   * Function to add all unadded categories to the list of categories
   */
  const addAllCategories = () => {
    setCategories([...categories, ...databaseCategories]);
  };

  /**
   * Function to delete a category from the list of categories
   *
   * @param {number} index index of category to delete
   */
  const deleteCategory = (index: number) => {
    const tempCategories = [...categories];
    tempCategories.splice(index, 1);
    setCategories(tempCategories);
  };

  /**
   * Function to handle changes in the start date input
   *
   * @param {ChangeEvent<HTMLInputElement>} event Change event for when the data input is changed
   */
  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setStartDate(newDate);
  };

  /**
   * Function to handle changes in the end date input
   *
   * @param {ChangeEvent<HTMLInputElement>} event Change event for when the data input is changed
   */
  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setEndDate(newDate);
  };

  /**
   * Function to set the date range to a specific number of days
   *
   * @param days number of days to process starting from current date
   */
  const handleDays = (days: number) => {
    const today: Date = new Date();
    const startDate: Date = new Date();
    startDate.setDate(today.getDate() - days);
    setStartDate(startDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  /**
   * Function to handle changes in the "All Transactions" checkbox.
   * Will disable all date functions when true, otherwise enable when false.
   *
   * @param {ChangeEvent<HTMLInputElement>} e Change event for when a tickbox is ticked
   */
  const handleAllTransactionsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateRangePopupContainer: HTMLDivElement = document.getElementById(
      "dateRangePopupContainer"
    ) as HTMLDivElement;
    const dynamicUpdatePopupContainer: HTMLLabelElement =
      document.getElementById(
        "dynamicUpdatePopupContainer"
      ) as HTMLLabelElement;

    if (e.target.checked) {
      setAllTransactions(true);
      dateRangePopupContainer.style.display = "none";
      dynamicUpdatePopupContainer.style.display = "none";
    } else {
      setAllTransactions(false);
      dateRangePopupContainer.style.display = "block";
      dynamicUpdatePopupContainer.style.display = "block";
    }
  };

  /**
   * Function to handle changes in the "Update graphs automatically" checkbox
   *
   * @param {ChangeEvent<HTMLInputElement>} e Change event for when a tickbox is ticked
   */
  const handleDynamicUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateRangePopupContainer: HTMLDivElement = document.getElementById(
      "dateRangePopupContainer"
    ) as HTMLDivElement;
    const allTransactionsPopupContainer: HTMLLabelElement =
      document.getElementById(
        "allTransactionsPopupContainer"
      ) as HTMLLabelElement;
    const dynamicUpdateConfigurationContainer: HTMLLabelElement =
      document.getElementById(
        "dynamicUpdateConfigurationContainer"
      ) as HTMLLabelElement;

    if (e.target.checked) {
      setDynamicUpdate(true);
      dateRangePopupContainer.style.display = "none";
      allTransactionsPopupContainer.style.display = "none";
      dynamicUpdateConfigurationContainer.style.display = "block";
    } else {
      setDynamicUpdate(false);
      dateRangePopupContainer.style.display = "block";
      allTransactionsPopupContainer.style.display = "block";
      dynamicUpdateConfigurationContainer.style.display = "none";
    }
  };

  /**
   * Function to handle changes to either options for the Graph Configuration when the graph should update automatically
   */
  const handleDynamicUpdateConfiguration = () => {
    const lengthElement: HTMLInputElement = document.getElementById(
      "dynamicUpdateConfiguration"
    ) as HTMLInputElement;
    const unitElement: HTMLSelectElement = document.getElementById(
      "dynamicUpdateConfigurationSelect"
    ) as HTMLSelectElement;

    const length: number = parseInt(lengthElement.value);
    const unit: string = unitElement.options[unitElement.selectedIndex].value;

    setLengthValue(length);

    if (unit === "day") {
      setLengthOfDays(length);
    } else if (unit === "week") {
      setLengthOfDays(length * 7);
    } else if (unit === "month") {
      setLengthOfDays(length * 31);
    } else {
      setLengthOfDays(length * 365);
    }
  };

  /**
   * Ensure input is always 1 or larger
   */
  const handleInputBlur = () => {
    // Handle blur event
    if (lengthValue < 1 || isNaN(lengthValue)) {
      // If the value is less than 1 or not a valid number, set it to 1
      setLengthValue(1);
    }
  };

  /**
   * Function to create the graph configuration and add it to the list of configurations
   */
  const createGraphConfig = () => {
    // Validation checking
    let daysDifference: number;
    let dateStart: Date;
    let dateEnd: Date;

    if (allTransactions) {
      daysDifference = -1;
      dateStart = new Date();
      dateEnd = new Date();
    } else if (dynamicUpdate) {
      daysDifference = lengthOfDays;
      dateStart = new Date();
      dateEnd = new Date();
    } else {
      if (!startDate || !endDate) {
        // TODO: Add error handling message for user
        console.log("Error: Missing start or end date");
        return;
      }

      if (startDate > endDate) {
        // TODO: Add error handling message for user
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
      // TODO: Add error handling message for user
      console.log("Error: No category specified");
      return;
    }

    if (accounts.length === 0) {
      // TODO: Add error handling message for user
      console.log("Error: No account specified");
      return;
    }

    // New GraphConfig object
    const graphConfig: GraphConfig = {
      id: uuidv4(),
      startDate: dateStart,
      endDate: dateEnd,
      length: daysDifference,
      categories: categories.map((category) => category.id),
      accounts: accounts.map((account) => account.id),
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
      {/* TODO: have an automatically updating graph */}
      <canvas id="configureGraph"></canvas>

      {/* Account Selection */}
      <div id="accountPopupContainer">
        <h1>Select Accounts</h1>
        {/* List of accounts from database */}
        <AccountContext.Provider value={databaseAccounts}>
          <select id="addAccount">
            {databaseAccounts.map((account: Account, index: number) => (
              <option value={account.id} key={index}>
                {account.name}
              </option>
            ))}
          </select>
        </AccountContext.Provider>

        <button onClick={addAccount}>Add Account</button>
        <button onClick={addAllAccounts}>Add All Accounts</button>

        {/* List of selected accounts */}
        <ul>
          {accounts.map((item: Account, index) => (
            <li key={`account${index}`}>
              {item.name}
              <button onClick={() => deleteAccount(index)}>remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Category Selection */}
      <div id="categoryPopupContainer">
        <h1>Select Categories</h1>
        {/* List of categories from database */}
        <CategoryContext.Provider value={databaseCategories}>
          <select id="addCategories">
            {databaseCategories.map((category: Category, index: number) => (
              <option value={category.id} key={index}>
                {category.name}
              </option>
            ))}
          </select>
        </CategoryContext.Provider>

        <button onClick={addCategory}>Add Category</button>
        <button onClick={addAllCategories}>Add All Categories</button>

        {/* List of selected categories */}
        <ul>
          {categories.map((item: Category, index) => (
            <li key={`category${index}`}>
              {item.name}
              <button onClick={() => deleteCategory(index)}>X</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Date Range Selection */}
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

        {/* Automatically set dates for 7 days from today */}
        <button
          id="days7Popup"
          onClick={() => {
            handleDays(7);
          }}
        >
          7 Days
        </button>

        {/* Automatically set dates for 31 days from today */}
        <button
          id="days14Popup"
          onClick={() => {
            handleDays(14);
          }}
        >
          14 Days
        </button>

        {/* Automatically set dates for 31 days from today */}
        <button
          id="days31Popup"
          onClick={() => {
            handleDays(31);
          }}
        >
          1 month
        </button>
      </div>

      {/* Additional Options */}
      <div id="additionalOptionsPopupContainer">
        <label
          id="allTransactionsPopupContainer"
          htmlFor="allTransactionsPopup"
          className="custom-checkbox"
        >
          All Transactions
          <input
            type="checkbox"
            id="allTransactionsPopup"
            onChange={handleAllTransactionsChange}
          />
          <span className="checkmark"></span>
        </label>

        <label
          id="dynamicUpdatePopupContainer"
          htmlFor="dynamicUpdatePopup"
          className="custom-checkbox"
        >
          Update graphs automatically as time passes
          <input
            type="checkbox"
            id="dynamicUpdatePopup"
            onChange={handleDynamicUpdateChange}
          />
          <span className="checkmark"></span>
        </label>

        {/* Additional Options when Update Graphs automatically is enabled */}
        <label
          id="dynamicUpdateConfigurationContainer"
          htmlFor="dynamicUpdateConfiguration"
          style={{ display: "none" }}
        >
          Update to include last
          {/* Length of time */}
          <input
            type="number"
            id="dynamicUpdateConfiguration"
            onChange={handleDynamicUpdateConfiguration}
            min="1"
            onBlur={handleInputBlur}
            value={lengthValue}
          />
          {/* Unit of time */}
          <select
            id="dynamicUpdateConfigurationSelect"
            onChange={handleDynamicUpdateConfiguration}
          >
            <option value="day">Days</option>
            <option value="week">Weeks</option>
            <option value="month">Months</option>
            <option value="year">Years</option>
          </select>
        </label>
      </div>

      {/* Add graph */}
      <button onClick={createGraphConfig}>Add Graph</button>
    </div>
  );
}
