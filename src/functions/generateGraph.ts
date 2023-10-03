/*
const config = {
    type: 'line',
    data: {},
    options: {},
    plugins: []
}

/*
let flattendTransactions: FlattenedTransaction = transactions.flatMap((t) =>
  t.details.map((d) => ({ ...d, date: t.date, merchant: t.merchant }))
);

*/
import { ChartConfiguration, ChartData, ChartOptions, ChartType, TooltipItem } from "chart.js";
import { Transaction, FlattenedTransaction } from "../types/transaction";

export function generateGraph(/*transactions: Transaction[],*/ type: string) {
  // testing purposes
  const transactions: Transaction[] = getTestData();

  // test data finished

  const rawData: FlattenedTransaction[] = getData(transactions);
  let data: ChartData;
  if (type == "pie" || type == "bar" || type == "polarArea") {
    data = getDataByCategory(rawData);
  } else {
    data = getDataByDate(rawData);
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

// Flatten each transaction into one single one
function getData(transactions: Transaction[]): FlattenedTransaction[] {
  const flattendTransactions: FlattenedTransaction[] = transactions.flatMap(
    (t) => t.details.map((d) => ({ ...d, date: t.date, merchant: t.merchant }))
  );

  return flattendTransactions;
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

  console.log(data);
  console.log(labels);
  console.log(values);

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

  console.log(data);
  console.log(labels);
  console.log(values);

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

function getTestData() {
  const transactions: Transaction[] = [
    {
      id: "01", // uuid
      date: new Date("2021-01-01"),
      merchant: "Countdown",
      details: [{ amount: 7, category: "Food" }]
    },
    {
      id: "02", // uuid
      date: new Date("2021-01-01"),
      merchant: "New World",
      details: [{ amount: 10, category: "Food" }]
    },
    {
      id: "03", // uuid
      date: new Date("2021-01-02"),
      merchant: "The Warehouse",
      details: [
        { amount: 27, category: "Food" },
        { amount: 150, category: "Clothes" }
      ]
    },
    {
      id: "04", // uuid
      date: new Date("2021-01-03"),
      merchant: "The Warehouse",
      details: [
        { amount: 27, category: "Entertainment" },
        { amount: 30, category: "Clothes" }
      ]
    }
  ];

  return transactions;
}
