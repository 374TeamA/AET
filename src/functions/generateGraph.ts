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
  // Convert to dollars
  transactions.forEach((transaction) => {
    transaction.amount /= 100;
  });

  // Decide how to process data based on type of graph
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

// TODO: rewrite all of this
// It needs to handle multiple categories and show a line for each, along with a label
// It needs to generate a date and populate it with $0 if no money was spent that day
function getDataByDate(rawData: FlattenedTransaction[]) {
  const categories: string[] = [];
  const startDate: Date = rawData[0].date;
  const endDate: Date = rawData[rawData.length - 1].date;

  // populate array with dates between start and end (inclusive)
  const dates: Date[] = [];
  const currentDate: Date = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // get all categories
  for (let i = 0; i < rawData.length; i++) {
    if (!categories.includes(rawData[i].category)) {
      categories.push(rawData[i].category);
    }
  }

  // convert each date in the array into a string in the format "Month Day, Year"
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
        for (let k = 0; k < rawData.length; k++) {
          if (
            rawData[k].category == category &&
            rawData[k].date.toDateString() == date.toDateString()
          ) {
            total += rawData[k].amount;
          }
        }
        categoryValues.push(total);
      }
      datasets.push({
        label: category,
        data: categoryValues
      });
    }

    const totalValues: number[] = [];
    for (let i = 0; i < labels.length; i++) {
      totalValues.push(0);
    }

    for (let i = 0; i < rawData.length; i++) {
      const date: string = rawData[i].date.toDateString();
      const index: number = labels.indexOf(date);
      totalValues[index] += rawData[i].amount;
    }

    datasets.push({
      label: "Total",
      data: totalValues
    });

    const data: ChartData = {
      labels: labels,
      datasets: datasets
    };
    return data;
  }

  for (let i = 0; i < rawData.length; i++) {
    const date: string = rawData[i].date.toDateString();
    const index: number = labels.indexOf(date);
    values[index] += rawData[i].amount;
  }

  const data: ChartData = {
    labels: labels,
    datasets: [
      {
        label: categories[0],
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
    interaction: {
      mode: "index",
      intersect: false
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
