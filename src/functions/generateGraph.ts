import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  TooltipItem
} from "chart.js";
import { FlattenedTransaction } from "../types/transaction";
import { GraphConfig } from "../types/graph";

//TODO: All this code is likely to be changed soon so not gonna comment it
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
    data = getDataByCategory(transactions, graphConfig);
  } else {
    data = getDataByDate(transactions, graphConfig);
  }

  const chartType: ChartType = graphConfig.type as ChartType;
  const options = getOptions(graphConfig.type);
  // Config
  // TODO: set this to be dynamic for different graph types
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
 * @param {FlattenedTransaction[]} rawData
 * @return {ChartData} formatted ChartData object for ChartJS
 */
function getDataByCategory(
  rawData: FlattenedTransaction[],
  graphConfig: GraphConfig
): ChartData {
  const labels: string[] = [];
  const values: number[] = [];
  const filteredData: FlattenedTransaction[] = [];

  for (let i = 0; i < rawData.length; i++) {
    const category: string = rawData[i].category;

    if (graphConfig.categories.includes(category)) {
      if (!labels.includes(category)) {
        labels.push(category);
        values.push(0);
      }

      filteredData.push(rawData[i]);
      const index: number = labels.indexOf(category);
      values[index] += rawData[i].amount;
    }
  }

  if (
    (graphConfig.groupBy == "week" ||
      graphConfig.groupBy == "month" ||
      graphConfig.groupBy == "year") &&
    graphConfig.type == "bar"
  ) {
    //handle it
    let grouped: Record<string, FlattenedTransaction[]> = {};

    if (graphConfig.groupBy == "week") {
      grouped = groupObjectsByWeek(filteredData);
    } else if (graphConfig.groupBy == "month") {
      grouped = groupObjectsByMonth(filteredData);
    } else {
      //group by year
      grouped = groupObjectsByYear(filteredData);
    }

    const datasets = [];

    for (const [key, value] of Object.entries(grouped)) {
      const categoryValues = [];
      for (let i = 0; i < labels.length; i++) {
        categoryValues.push(0);
      }

      for (let i = 0; i < value.length; i++) {
        const category = value[i].category;
        const index = labels.indexOf(category);
        categoryValues[index] += value[i].amount;
      }

      datasets.push({
        label: key,
        data: categoryValues
      });
    }

    const data: ChartData = {
      labels: labels,
      datasets: datasets
    };

    return data;
  }

  const data: ChartData = {
    labels: labels,
    datasets: [
      {
        label: "Total",
        data: values
      }
    ]
  };

  return data;
}

function groupObjectsByWeek(array: FlattenedTransaction[]) {
  const grouped: Record<string, FlattenedTransaction[]> = {};

  array.forEach((item) => {
    const date = new Date(item.date);
    const weekStartDate = new Date(date);
    weekStartDate.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // Find the previous Monday
    weekStartDate.setHours(0, 0, 0, 0); // Set time to midnight

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); // Set the week's end to Sunday

    const weekKey = `${"Week of "}${weekStartDate.getDate()} ${monthToString(
      weekStartDate.getMonth()
    )} ${weekStartDate.getFullYear()}`;

    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }

    grouped[weekKey].push(item);
  });

  return grouped;
}

function groupObjectsByMonth(array: FlattenedTransaction[]) {
  const grouped: Record<string, FlattenedTransaction[]> = {};

  array.forEach((item) => {
    const date = new Date(item.date);
    const monthStartDate = new Date(date);
    monthStartDate.setDate(1); // Set to the first day of the month
    monthStartDate.setHours(0, 0, 0, 0); // Set time to midnight

    const monthKey = `${monthToLongString(
      monthStartDate.getMonth()
    )} ${monthStartDate.getFullYear()}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }

    grouped[monthKey].push(item);
  });

  return grouped;
}

function groupObjectsByYear(array: FlattenedTransaction[]) {
  const grouped: Record<string, FlattenedTransaction[]> = {};

  array.forEach((item) => {
    const date = new Date(item.date);
    const yearStartDate = new Date(date);
    yearStartDate.setMonth(0, 1); // Set to the first day of the year
    yearStartDate.setHours(0, 0, 0, 0); // Set time to midnight

    const yearKey = `${yearStartDate.getFullYear()}`;

    if (!grouped[yearKey]) {
      grouped[yearKey] = [];
    }

    grouped[yearKey].push(item);
  });

  return grouped;
}

// TODO: rewrite all of this
// It needs to handle multiple categories and show a line for each, along with a label
// It needs to generate a date and populate it with $0 if no money was spent that day
function getDataByDate(
  rawData: FlattenedTransaction[],
  graphConfig: GraphConfig
) {
  const categories: string[] = [];
  const filteredData: FlattenedTransaction[] = [];
  const startDate: Date = rawData[0].date;
  const endDate: Date = rawData[rawData.length - 1].date;

  // get all categories
  for (let i = 0; i < rawData.length; i++) {
    if (graphConfig.categories.includes(rawData[i].category)) {
      filteredData.push(rawData[i]);

      if (!categories.includes(rawData[i].category)) {
        categories.push(rawData[i].category);
      }
    }
  }

  // Handle grouping
  if (graphConfig.groupBy !== "day") {
    let grouped: Record<string, FlattenedTransaction[]> = {};
    if (graphConfig.groupBy == "week") {
      grouped = groupObjectsByWeek(filteredData);
    } else if (graphConfig.groupBy == "month") {
      grouped = groupObjectsByMonth(filteredData);
    } else if (graphConfig.groupBy == "year") {
      grouped = groupObjectsByYear(filteredData);
    }

    const datasets = [];

    const labels: string[] = Object.keys(grouped);
    const values: number[] = [];

    for (let i = 0; i < labels.length; i++) {
      values.push(0);
    }

    for (let i = 0; i < categories.length; i++) {
      //
      const category = categories[i];
      const categoryValues = [];
      for (let j = 0; j < labels.length; j++) {
        let total = 0;
        for (let k = 0; k < grouped[labels[j]].length; k++) {
          if (grouped[labels[j]][k].category == category) {
            total += grouped[labels[j]][k].amount;
          }
        }
        categoryValues.push(total);
      }

      datasets.push({
        label: category,
        data: categoryValues,
        pointStyle: false
      });
    }

    if (categories.length > 1) {
      for (let i = 0; i < labels.length; i++) {
        let total = 0;
        for (let j = 0; j < categories.length; j++) {
          total += datasets[j].data[i];
        }
        values[i] = total;
      }

      datasets.push({
        label: "Total",
        data: values,
        pointStyle: false
      });
    }

    const data: ChartData = {
      labels: labels,
      datasets: datasets
    };

    return data;
  }

  // populate array with dates between start and end (inclusive)
  const dates: Date[] = [];
  const currentDate: Date = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // convert each date in the array into a string in the format "Day Month Day, Year"
  const labels: string[] = [];
  dates.forEach((date) => {
    labels.push(date.toDateString());
  });

  const values: number[] = [];
  for (let i = 0; i < labels.length; i++) {
    values.push(0);
  }

  if (categories.length > 1) {
    // More than 1 category
    const datasets = [];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const categoryValues = [];
      for (let j = 0; j < labels.length; j++) {
        const date = new Date(labels[j]);
        let total = 0;
        for (let k = 0; k < filteredData.length; k++) {
          if (
            filteredData[k].category == category &&
            filteredData[k].date.toDateString() == date.toDateString()
          ) {
            total += filteredData[k].amount;
          }
        }
        categoryValues.push(total);
      }
      datasets.push({
        label: category,
        data: categoryValues,
        pointStyle: false
      });
    }

    const totalValues: number[] = [];
    for (let i = 0; i < labels.length; i++) {
      totalValues.push(0);
    }

    for (let i = 0; i < filteredData.length; i++) {
      const date: string = filteredData[i].date.toDateString();
      const index: number = labels.indexOf(date);
      totalValues[index] += filteredData[i].amount;
    }

    datasets.push({
      label: "Total",
      data: totalValues,
      pointStyle: false
    });

    const data: ChartData = {
      labels: labels,
      datasets: datasets
    };
    return data;
  }

  for (let i = 0; i < filteredData.length; i++) {
    const date: string = filteredData[i].date.toDateString();
    const index: number = labels.indexOf(date);
    values[index] += filteredData[i].amount;
  }

  const data: ChartData = {
    labels: labels,
    datasets: [
      {
        label: categories[0],
        data: values,
        pointStyle: false
      }
    ]
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
