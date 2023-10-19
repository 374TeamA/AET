// Import statements
import { ChangeEvent, useContext, useState } from "react";
import { GraphConfig } from "../types/graph";
import { ChartType } from "chart.js";
import { v4 as uuidv4 } from "uuid";
import { Account } from "../types/account";
import { Category } from "../types/category";
import { AccountContext } from "../context/AccountsContext";
import { CategoryContext } from "../context/CategoryContext";
import CustomButton from "./CustomButton";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

function capitalizeFirstLetter(str: string) {
  if (str.length === 0) return str; // Handle empty string
  return str[0].toUpperCase() + str.slice(1);
}

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
  const [groupBy, setGroupBy] = useState<string>("day");
  const databaseAccounts = useContext(AccountContext);
  const databaseCategories = useContext(CategoryContext);
  const [lengthValue, setLengthValue] = useState(1);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    databaseAccounts && databaseAccounts[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    databaseCategories[0]
  );

  /**
   * Function to add a selected account to the list of accounts
   */
  const addAccount = () => {
    // // Get the selected option
    // const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (!selectedAccount) return;
    // Get the value of the selected option
    const account: Account = selectedAccount;

    // Add the account to the list of accounts if it doesn't already exist
    if (!accounts.some((a) => a.id === account.id)) {
      setAccounts([...accounts, account]);
    }
  };

  /**
   * Function to add all unadded accounts to the list of accounts
   */
  const addAllAccounts = () => {
    // add any accounts from database accounts that arent already in accounts (so there are no duplicates)
    if (databaseAccounts) {
      const uniqueAccounts = databaseAccounts.filter(
        (account) => !accounts.some((a) => a.id === account.id)
      );
      setAccounts([...accounts, ...uniqueAccounts]);
    }
  };

  /**
   * Function to delete an account from the list of accounts
   *
   * @param {Account} account index of account to delete
   */
  const deleteAccount = (account: Account) => {
    // Remove the account from the list of accounts
    setAccounts(accounts.filter((a) => a !== account));
  };

  /**
   * Function to add a selected category to the list of categories
   */
  const addCategory = () => {
    // Get the value of the selected option
    const category: Category | undefined = selectedCategory;

    // Add the category to the list of categories if it doesn't already exist
    if (category) {
      if (!categories.some((c) => c.id === category.id)) {
        setCategories([...categories, category]);
      }
    }
  };

  /**
   * Function to add all unadded categories to the list of categories
   */
  const addAllCategories = () => {
    // add any categories from database catagories that arent already in categories (so there are no duplicates)
    if (databaseCategories) {
      const uniqueCategories = databaseCategories.filter(
        (category) => !categories.some((c) => c.id === category.id)
      );
      setCategories([...categories, ...uniqueCategories]);
    }
  };

  /**
   * Function to delete a category from the list of categories
   *
   * @param {number} category index of category to delete
   */
  const deleteCategory = (category: Category) => {
    // Remove the category from the list of categories
    setCategories(categories.filter((c) => c !== category));
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

  // TODO: This needs to be fixed so it actually handles a month correctly
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
    // Get the date range popup container and the dynamic update popup container
    // TODO: This could probably be changed to use refs instead of getElementById
    const dateRangePopupContainer: HTMLDivElement = document.getElementById(
      "dateRangePopupContainer"
    ) as HTMLDivElement;
    const dynamicUpdatePopupContainer: HTMLLabelElement =
      document.getElementById(
        "dynamicUpdatePopupContainer"
      ) as HTMLLabelElement;

    // If the checkbox is ticked, disable the date range and dynamic update options and vice versa
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
    // Get the date range popup container and the all transactions popup container
    // TODO: This could probably be changed to use refs instead of getElementById
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

    // If the checkbox is ticked, disable the date range and all transactions options and vice versa
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
    // Get the length and unit elements
    // TODO: This could probably be changed to use refs instead of getElementById
    const lengthElement: HTMLInputElement = document.getElementById(
      "dynamicUpdateConfiguration"
    ) as HTMLInputElement;
    const unitElement: HTMLSelectElement = document.getElementById(
      "dynamicUpdateConfigurationSelect"
    ) as HTMLSelectElement;

    // Get the length and unit values
    const length: number = parseInt(lengthElement.value);
    const unit: string = unitElement.options[unitElement.selectedIndex].value;

    setLengthValue(length);

    // Set the length of days based on the unit
    // TODO: Jake this needs to be changed to handle months correctly
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
   * Handle changes to the group by select
   *
   * @param e ChangeEvent for when the group by select is changed
   */
  const handleGroupByChange = (e: SelectChangeEvent<unknown>) => {
    setGroupBy(e.target.value as string);
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
      categories: categories.map((category) => category.name),
      accounts: accounts.map((account) => account.id),
      type: type as ChartType,
      favourite: 0,
      update: dynamicUpdate,
      allTransactions: allTransactions,
      groupBy: groupBy
    };

    addGraphConfig(graphConfig);
    handleClose();
  };

  return (
    <div>
      <div className="popupHeader">
        <h1 className="font-1-5-rem">
          Configure {capitalizeFirstLetter(type)} Graph
        </h1>
      </div>

      {/* Account Selection */}
      <div
        id="accountPopupContainer"
        className="padding-0-5rem border-1px-solid-lightgrey border-radius-0-5rem margin-top-0-5rem"
      >
        <h1 style={{ fontSize: "1.2rem" }}>Select Accounts</h1>
        {/* List of accounts from database */}
        <div className="display-flex justify-space-between padding-right-0-3rem">
          <Select
            id="addAccount"
            defaultValue={databaseAccounts && databaseAccounts[0].id}
            size="small"
            onChange={(e) => {
              const account: Account | undefined = databaseAccounts?.find(
                (a) => a.id === e.target.value
              );
              setSelectedAccount(account ? account : null);
            }}
          >
            {databaseAccounts &&
              databaseAccounts.map((account: Account, index: number) => (
                <MenuItem value={account.id} key={index}>
                  {account.name}
                </MenuItem>
              ))}
          </Select>

          <CustomButton onClick={addAccount}>Add Account</CustomButton>
          <CustomButton onClick={addAllAccounts}>Add All</CustomButton>
        </div>
        {/* List of selected accounts */}
        <ul>
          {accounts.map((item: Account, index) => (
            <li key={`account${index}`}>
              <div className="display-flex justify-space-between padding-0-2rem margin-0-2rem align-items-center">
                {item.name}
                <CustomButton onClick={() => deleteAccount(item)}>
                  remove
                </CustomButton>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Category Selection */}
      <div
        id="categoryPopupContainer"
        className="padding-0-5rem border-1px-solid-lightgrey border-radius-0-5rem margin-top-0-5rem"
      >
        <h1 className="font-1-2rem ">Select Categories</h1>
        {/* List of categories from database */}
        <div className="display-flex justify-space-between padding-right-0-3rem">
          <Select
            id="addCategories"
            defaultValue={databaseCategories[0].id}
            size="small"
            onChange={(e) => {
              const category: Category | undefined = databaseCategories.find(
                (c) => c.id === e.target.value
              );
              setSelectedCategory(category ? category : databaseCategories[0]);
            }}
          >
            {databaseCategories.map((category: Category, index: number) => (
              <MenuItem value={category.name} key={index}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <CustomButton onClick={addCategory}>Add Category</CustomButton>
          <CustomButton onClick={addAllCategories}>Add All</CustomButton>
        </div>

        {/* List of selected categories */}
        <ul>
          {categories.map((item: Category, index) => (
            <li key={`category${index}`} style={{ margin: "0px" }}>
              <div className="display-flex justify-space-between padding-0-2rem margin-0-2rem align-items-center">
                <p style={{ paddingLeft: "0.5rem" }}>{item.name}</p>
                <CustomButton onClick={() => deleteCategory(item)}>
                  Remove
                </CustomButton>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Date Range Selection */}
      <div
        id="dateRangePopupContainer"
        className="padding-0-5rem border-1px-solid-lightgrey border-radius-0-5rem margin-top-0-5rem"
      >
        <h1 className="font-1-2rem ">Select Date Range</h1>
        <div className="display-flex justify-space-between padding-0-5rem">
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
        </div>
        <div className="display-flex justify-space-evenly">
          {/* Automatically set dates for 7 days from today */}
          <CustomButton
            id="days7Popup"
            onClick={() => {
              handleDays(7);
            }}
          >
            7 Days
          </CustomButton>

          {/* Automatically set dates for 31 days from today */}
          <CustomButton
            id="days14Popup"
            onClick={() => {
              handleDays(14);
            }}
          >
            14 Days
          </CustomButton>

          {/* Automatically set dates for 31 days from today */}
          <CustomButton
            id="days31Popup"
            onClick={() => {
              handleDays(31);
            }}
          >
            1 month
          </CustomButton>
        </div>
      </div>

      {/* Additional Options */}
      <div
        id="additionalOptionsPopupContainer"
        className="padding-0-5rem border-1px-solid-lightgrey border-radius-0-5rem margin-top-0-5rem"
      >
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

        {type === "line" || type === "bar" ? (
          <div className="margin-0-5rem">
            <label htmlFor="grouped">
              Group by:
              <Select
                size="small"
                onChange={(e) => {
                  handleGroupByChange(e);
                }}
                id="grouped"
                defaultValue={type === "line" ? "day" : "none"}
              >
                {type === "line" ? (
                  <MenuItem value="day">Day</MenuItem>
                ) : (
                  <MenuItem value="none">None</MenuItem>
                )}
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </label>
          </div>
        ) : null}
      </div>
      {/* Add graph */}
      <div className="padding-0-5rem">
        <CustomButton onClick={createGraphConfig}>Add Graph</CustomButton>
        <CustomButton onClick={handleClose}>Cancel</CustomButton>
      </div>
    </div>
  );
}
