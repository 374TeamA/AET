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
import { ChartConfiguration } from "chart.js";
import { Transaction, FlattenedTransaction } from "../types/transaction";

export function generateGraph(/*transactions: Transaction[], type: string*/) {
  // testing purposes
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
      date: new Date("2021-01-01"),
      merchant: "The Warehouse",
      details: [
        { amount: 27, category: "Food" },
        { amount: 150, category: "Clothes" }
      ]
    }
  ];

  const rawData: FlattenedTransaction[] = getData(transactions);
  const type = "bar";
  const data = getDataByCategory(rawData);

  const config: ChartConfiguration = {
    type: type,
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // const data = {
  //   labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"],
  //   datasets: [
  //     {
  //       label: "Sample Data",
  //       data: [10, 20, 30, 40, 50],
  //       backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
  //       borderColor: "rgba(75, 192, 192, 1)", // Border color
  //       borderWidth: 1 // Border width
  //     }
  //   ]
  // };

  // // Define the chart configuration
  // const config = {
  //   type: "bar",
  //   data: data,
  //   options: {}
  // };
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

// Returns a dataset of data
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

  const data = {
    label: labels,
    datasets: [
      {
        label: "Sample Data",
        data: values
      }
    ]
  };

  console.log(data);

  return data;
}
