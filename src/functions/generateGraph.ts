import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  TooltipItem
} from "chart.js";
import { FlattenedTransaction } from "../types/transaction";
import { GraphConfig } from "../types/graph";

/**
 * Takes an array of FlattenedTransaction objects and converts them into a ChartData object.
 *
 * @export generateGraph function
 * @param {FlattenedTransaction[]} transactions Array of FlattenedTransaction objects that need to be processed
 * @param {GraphConfig} graphConfig GraphConfig object that contains the graph type, categories, and any other relevant information
 * @return {*} ChartConfiguration object for ChartJS
 */
export function generateGraph(
  transactions: FlattenedTransaction[],
  graphConfig: GraphConfig
) {
  // Convert to dollars
  transactions.forEach((transaction) => {
    transaction.amount /= 100;
  });

  // Decide how to process data based on type of graph
  let data: ChartData;
  if (
    graphConfig.type == "pie" ||
    graphConfig.type == "bar" ||
    graphConfig.type == "polarArea"
  ) {
    // Pie, bar, and polar area graphs are grouped by category
    data = getDataByCategory(transactions, graphConfig);
  } else {
    // Line graphs are grouped by date
    data = getDataByDate(transactions, graphConfig);
  }

  // Chart type
  const chartType: ChartType = graphConfig.type as ChartType;

  // Chart options
  const options = getOptions(graphConfig.type);

  // Chart configuration
  const config: ChartConfiguration = {
    type: chartType,
    data: data,
    options: options as ChartOptions
  };

  console.log(config);

  return config;
}

/**
 * Takes an array of FlattenedTransaction objects and converts them into a ChartData object.
 * Transactions are separated into categories, with each category totalling the amount from each relevant transaction.
 *
 * @param {FlattenedTransaction[]} rawData Array of FlattenedTransaction objects that need to be processed
 * @param {GraphConfig} graphConfig GraphConfig object that contains the graph type, categories, and any other relevant information
 * @return {ChartData} formatted ChartData object for ChartJS
 */
function getDataByCategory(
  rawData: FlattenedTransaction[],
  graphConfig: GraphConfig
): ChartData {
  // Variables
  const categories: string[] = [];
  const values: number[] = [];
  const filteredData: FlattenedTransaction[] = [];
  const categoriesID = graphConfig.categories.map((category) => category.id);
  const categoriesName = graphConfig.categories.map(
    (category) => category.name
  );

  // Get all categories
  for (let i = 0; i < rawData.length; i++) {
    const categoryID: string = rawData[i].category;

    // If the category is in the list of categories, add it to the filtered data
    if (categoriesID.includes(categoryID)) {
      const categoryIndex: number = categoriesID.indexOf(categoryID);

      // If the category is not in the list of categories, add it to the list of categories and initialize its value to 0
      if (!categories.includes(categoriesName[categoryIndex])) {
        categories.push(categoriesName[categoryIndex]);
        values.push(0);
      }

      // Add the transaction to the filtered data
      filteredData.push(rawData[i]);
      const index: number = categories.indexOf(categoriesName[categoryIndex]);
      values[index] += rawData[i].amount;
    }
  }

  // Handle grouping if not the default "day" option and the graph type is bar
  if (
    (graphConfig.groupBy == "week" ||
      graphConfig.groupBy == "month" ||
      graphConfig.groupBy == "year") &&
    graphConfig.type == "bar"
  ) {
    // Group the transactions by week, month, or year
    let grouped: Record<string, FlattenedTransaction[]> = {};

    // Group by week, month, or year
    if (graphConfig.groupBy == "week") {
      grouped = groupObjectsByWeek(filteredData);
    } else if (graphConfig.groupBy == "month") {
      grouped = groupObjectsByMonth(filteredData);
    } else {
      grouped = groupObjectsByYear(filteredData);
    }

    // Create datasets
    const datasets = [];
    const labels: string[] = Object.keys(grouped);
    const values: number[] = [];

    // Initialize values array
    for (let i = 0; i < labels.length; i++) {
      values.push(0);
    }

    // Create a dataset for each category
    for (let i = 0; i < categoriesID.length; i++) {
      // Get the category
      const category = categoriesID[i];
      const categoryValues = [];

      // Get the total amount for each date range (week, month, year)
      for (let j = 0; j < labels.length; j++) {
        let total = 0;

        // Iterate through each transaction in the date range
        for (let k = 0; k < grouped[labels[j]].length; k++) {
          if (grouped[labels[j]][k].category == category) {
            total += grouped[labels[j]][k].amount;
          }
        }

        // Add the total amount to the array
        categoryValues.push(total);
      }

      const indexName = categoriesID.indexOf(category);

      // Add the dataset to the datasets array
      datasets.push({
        label: categoriesName[indexName],
        data: categoryValues,
        pointStyle: false
      });
    }

    // If there is more than 1 category, create a dataset for the total amount
    if (categories.length > 1) {
      // Get the total amount for each date range (week, month, year)
      for (let i = 0; i < labels.length; i++) {
        let total = 0;

        // Iterate through each category
        for (let j = 0; j < categories.length; j++) {
          // Add the total amount for the category to the total amount for the date range
          total += datasets[j].data[i];
        }

        // Add the total amount to the values array
        values[i] = total;
      }

      // Add the dataset to the datasets array
      datasets.push({
        label: "Total",
        data: values,
        pointStyle: false
      });
    }

    // Create the ChartData object
    const data: ChartData = {
      labels: labels,
      datasets: datasets
    };

    return data;
  }

  const data: ChartData = {
    labels: categories,
    datasets: [
      {
        label: "Total",
        data: values
      }
    ]
  };

  return data;
}

/**
 * Gets the data for the graph by date. This function is called when the graph type is not pie, bar, or polar area.
 *
 * @param rawData Array of FlattenedTransaction objects that need to be processed
 * @param graphConfig GraphConfig object that contains the graph type, categories, and any other relevant information
 * @returns {ChartData} formatted ChartData object for ChartJS
 */
function getDataByDate(
  rawData: FlattenedTransaction[],
  graphConfig: GraphConfig
): ChartData {
  // Variables
  const categories: string[] = [];
  const filteredData: FlattenedTransaction[] = [];
  const startDate: Date = rawData[0].date;
  const endDate: Date = rawData[rawData.length - 1].date;
  const categoriesID = graphConfig.categories.map((category) => category.id);
  const categoriesName = graphConfig.categories.map(
    (category) => category.name
  );

  // Get all categories
  for (let i = 0; i < rawData.length; i++) {
    if (categoriesID.includes(rawData[i].category)) {
      filteredData.push(rawData[i]);

      const index: number = categoriesID.indexOf(rawData[i].category);

      if (!categories.includes(categoriesName[index])) {
        categories.push(categoriesName[index]);
      }
    }
  }

  // Handle grouping if not the default "day" option
  if (graphConfig.groupBy !== "day") {
    let grouped: Record<string, FlattenedTransaction[]> = {};

    // Group by week, month, or year
    if (graphConfig.groupBy == "week") {
      grouped = groupObjectsByWeek(filteredData);
    } else if (graphConfig.groupBy == "month") {
      grouped = groupObjectsByMonth(filteredData);
    } else if (graphConfig.groupBy == "year") {
      grouped = groupObjectsByYear(filteredData);
    }

    // Create datasets
    const datasets = [];
    const labels: string[] = Object.keys(grouped);
    const values: number[] = [];

    // Initialize values array
    for (let i = 0; i < labels.length; i++) {
      values.push(0);
    }

    // Create a dataset for each category
    for (let i = 0; i < categoriesID.length; i++) {
      // Get the category
      const category = categoriesID[i];
      const categoryValues = [];

      // Get the total amount for each date range (week, month, year)
      for (let j = 0; j < labels.length; j++) {
        let total = 0;
        for (let k = 0; k < grouped[labels[j]].length; k++) {
          if (grouped[labels[j]][k].category == category) {
            total += grouped[labels[j]][k].amount;
          }
        }
        categoryValues.push(total);
      }

      const indexName = categoriesID.indexOf(category);

      // Add the dataset to the datasets array
      datasets.push({
        label: categoriesName[indexName],
        data: categoryValues,
        pointStyle: false
      });
    }

    // If there is more than 1 category, create a dataset for the total amount
    if (categories.length > 1) {
      // Get the total amount for each date range (week, month, year)
      for (let i = 0; i < labels.length; i++) {
        let total = 0;
        for (let j = 0; j < categories.length; j++) {
          total += datasets[j].data[i];
        }
        values[i] = total;
      }

      // Add the dataset to the datasets array
      datasets.push({
        label: "Total",
        data: values,
        pointStyle: false
      });
    }

    // Create the ChartData object
    const data: ChartData = {
      labels: labels,
      datasets: datasets
    };

    return data;
  }

  // populate array with dates between start and end (inclusive)
  const dates: Date[] = [];
  const currentDate: Date = new Date(startDate);

  // add each date to the array
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // convert each date in the array into a string in the format "Day Month Day, Year"
  const labels: string[] = [];
  dates.forEach((date) => {
    labels.push(date.toDateString());
  });

  // initialize values array
  const values: number[] = [];
  for (let i = 0; i < labels.length; i++) {
    values.push(0);
  }

  // create a dataset for each category
  const datasets = [];

  for (let i = 0; i < categoriesID.length; i++) {
    // get the category
    const category = categoriesID[i];
    const categoryValues = [];

    // get the total amount for each date
    for (let j = 0; j < labels.length; j++) {
      // convert the label back into a date object
      const date = new Date(labels[j]);
      let total = 0;

      // get the total amount for the date and category
      for (let k = 0; k < filteredData.length; k++) {
        if (
          filteredData[k].category == category &&
          filteredData[k].date.toDateString() == date.toDateString()
        ) {
          total += filteredData[k].amount;
        }
      }

      // add the total amount to the array
      categoryValues.push(total);
    }

    const indexName = categoriesID.indexOf(category);
    // add the dataset to the datasets array
    datasets.push({
      label: categoriesName[indexName],
      data: categoryValues,
      pointStyle: false
    });
  }

  // if there is more than 1 category, create a dataset for the total amount
  if (categories.length > 1) {
    // get the total amount for each date
    const totalValues: number[] = [];

    // initialize values array
    for (let i = 0; i < labels.length; i++) {
      totalValues.push(0);
    }

    // get the total amount for each date
    for (let i = 0; i < filteredData.length; i++) {
      const date: string = filteredData[i].date.toDateString();
      const index: number = labels.indexOf(date);
      totalValues[index] += filteredData[i].amount;
    }

    // add the dataset to the datasets array
    datasets.push({
      label: "Total",
      data: totalValues,
      pointStyle: false
    });
  }

  // create the ChartData object
  const data: ChartData = {
    labels: labels,
    datasets: datasets
  };

  return data;
}

/**
 * Gets the options for the graph depending on the type
 *
 * @param {string} type Graph type as a string
 * @returns {ChartOptions} The options for the graph depending on the type
 */
function getOptions(type: string) {
  // Bar graph options
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string) {
            if (parseInt(value) >= 1000) {
              return (
                "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            } else {
              return "$" + value;
            }
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Bar Graph"
      },
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }

            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  // Pie graph options
  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: "Pie Graph"
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"pie">) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  // Polar area graph options
  const polarOptions = {
    plugins: {
      title: {
        display: true,
        text: "Polar Area Graph"
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"polarArea">) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.r !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(context.parsed.r);
            }

            return label;
          }
        }
      }
    }
  };

  // Line graph options
  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string) {
            if (parseInt(value) >= 1000) {
              return (
                "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            } else {
              return "$" + value;
            }
          }
        }
      }
    },
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: "Line Graph"
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }

            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  // Returns the correct options based on the type of graph
  if (type == "bar") {
    return barOptions;
  } else if (type == "pie") {
    return pieOptions;
  } else if (type == "polarArea") {
    return polarOptions;
  } else {
    return lineOptions;
  }
}

/**
 * Gets the string representation of a month from its number in short form (e.g. 0 -> Jan)
 *
 * @param {number} month The month number
 * @return {string} The string representation of the month
 */
function monthToString(month: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return months[month];
}

/**
 * Gets the string representation of a month from its number in long form (e.g. 0 -> January)
 *
 * @param {number} month The month number
 * @return {string} The string representation of the month
 */
function monthToLongString(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return months[month];
}

/**
 * Groups an array of FlattenedTransaction objects by week. The week starts on Monday and ends on Sunday.
 *
 * @param {FlattenedTransaction[]} array Array of FlattenedTransaction objects
 * @return {Record<string, FlattenedTransaction[]>} Object with keys as the week and values as an array of FlattenedTransaction objects
 */
function groupObjectsByWeek(
  array: FlattenedTransaction[]
): Record<string, FlattenedTransaction[]> {
  const grouped: Record<string, FlattenedTransaction[]> = {};

  // Iterate through each transaction
  array.forEach((item) => {
    // Get the date of the transaction
    const date = new Date(item.date);
    const weekStartDate = new Date(date);
    weekStartDate.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // Find the previous Monday
    weekStartDate.setHours(0, 0, 0, 0); // Set time to midnight

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); // Set the week's end to Sunday

    // Create the key for the week
    const weekKey = `${"Week of "}${weekStartDate.getDate()} ${monthToString(
      weekStartDate.getMonth()
    )} ${weekStartDate.getFullYear()}`;

    // If the key doesn't exist, create it
    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }

    // Add the transaction to the week
    grouped[weekKey].push(item);
  });

  return grouped;
}

/**
 * Groups an array of FlattenedTransaction objects by month. The month starts on the first day of the month.
 *
 * @param {FlattenedTransaction[]} array Array of FlattenedTransaction objects
 * @return {Record<string, FlattenedTransaction[]>} Object with keys as the month and values as an array of FlattenedTransaction objects
 */
function groupObjectsByMonth(
  array: FlattenedTransaction[]
): Record<string, FlattenedTransaction[]> {
  const grouped: Record<string, FlattenedTransaction[]> = {};

  // Iterate through each transaction
  array.forEach((item) => {
    // Get the date of the transaction
    const date = new Date(item.date);
    const monthStartDate = new Date(date);
    monthStartDate.setDate(1); // Set to the first day of the month
    monthStartDate.setHours(0, 0, 0, 0); // Set time to midnight

    // Create the key for the month
    const monthKey = `${monthToLongString(
      monthStartDate.getMonth()
    )} ${monthStartDate.getFullYear()}`;

    // If the key doesn't exist, create it
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }

    // Add the transaction to the month
    grouped[monthKey].push(item);
  });

  return grouped;
}

/**
 * Groups an array of FlattenedTransaction objects by year. The year starts on January 1st.
 *
 * @param {FlattenedTransaction[]} array Array of FlattenedTransaction objects
 * @return {Record<string, FlattenedTransaction[]>} Object with keys as the year and values as an array of FlattenedTransaction objects
 */
function groupObjectsByYear(
  array: FlattenedTransaction[]
): Record<string, FlattenedTransaction[]> {
  const grouped: Record<string, FlattenedTransaction[]> = {};

  // Iterate through each transaction
  array.forEach((item) => {
    // Get the date of the transaction
    const date = new Date(item.date);
    const yearStartDate = new Date(date);
    yearStartDate.setMonth(0, 1); // Set to the first day of the year
    yearStartDate.setHours(0, 0, 0, 0); // Set time to midnight

    // Create the key for the year
    const yearKey = `${yearStartDate.getFullYear()}`;

    // If the key doesn't exist, create it
    if (!grouped[yearKey]) {
      grouped[yearKey] = [];
    }

    // Add the transaction to the year
    grouped[yearKey].push(item);
  });

  return grouped;
}
