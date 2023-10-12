import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  TooltipItem
} from "chart.js";
import { FlattenedTransaction } from "../types/transaction";

//TODO: All this code is likely to be changed soon so not gonna comment it
export function generateGraph(
  transactions: FlattenedTransaction[],
  type: string
) {
  // testing purposes
  console.log("Generating graphs from flattended");

  transactions.forEach((transaction) => {
    transaction.amount /= 100;
  });

  console.log(transactions);

  let data: ChartData;
  if (type == "pie" || type == "bar" || type == "polarArea") {
    data = getDataByCategory(transactions);
  } else {
    data = getDataByDate(transactions);
  }

  const chartType: ChartType = type as ChartType;
  const options = getOptions(type);
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
function getDataByCategory(rawData: FlattenedTransaction[]) {
  const labels: string[] = [];
  const values: number[] = [];

  for (let i = 0; i < rawData.length; i++) {
    const category: string = rawData[i].category;

    if (!labels.includes(category)) {
      labels.push(category);
      values.push(0);
    }

    const index: number = labels.indexOf(category);
    values[index] += rawData[i].amount;
  }

  const data: ChartData = {
    labels: labels,
    datasets: [
      {
        data: values
      }
    ]
  };

  return data;
}

function getDataByDate(rawData: FlattenedTransaction[]) {
  const labels: string[] = [];
  const values: number[] = [];

  for (let i = 0; i < rawData.length; i++) {
    const date: string = rawData[i].date.toDateString();

    if (!labels.includes(date)) {
      labels.push(date);
      values.push(0);
    }

    const index: number = labels.indexOf(date);
    values[index] += rawData[i].amount;
  }

  const data: ChartData = {
    labels: labels,
    datasets: [
      {
        data: values
      }
    ]
  };

  return data;
}

function getOptions(type: string) {
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
        text: "Test"
      },
      legend: {
        display: false
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

  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: "Test"
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

  const polarOptions = {
    plugins: {
      title: {
        display: true,
        text: "Test"
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
    plugins: {
      title: {
        display: true,
        text: "Test"
      },
      legend: {
        display: false
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
