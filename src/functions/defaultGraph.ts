import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  TooltipItem
} from "chart.js/auto";

export function defaultBarGrpah() {
  const data: ChartData = {
    labels: [
      "Food",
      "Transportation",
      "Utilities",
      "Housing",
      "Clothing",
      "Medical/Insurence",
      "Household Items"
    ],
    datasets: [
      {
        label: "Spending for March",
        data: [418, 120, 250, 1500, 55, 150, 44],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)"
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)"
        ],
        borderWidth: 1
      }
    ]
  };

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
        text: "Spending for March"
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

  const config: ChartConfiguration = {
    type: "bar",
    data: data,
    options: barOptions as ChartOptions
  };

  console.log(config);

  return config;
}

export function defaultLineGraph() {
  const data = {
    labels: [
      "01/01/2023",
      "02/01/2023",
      "03/01/2023",
      "04/01/2023",
      "05/01/2023",
      "06/01/2023",
      "07/01/2023"
    ],
    datasets: [
      {
        label: "Spending for Food",
        data: [40, 13, 5, 0, 54, 193, 72],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)"
      },
      {
        label: "Spending for Clothing",
        data: [15, 30, 0, 0, 23, 67, 28],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)"
      }
    ]
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
        text: "Spending for a week for Food and Clothing"
      },
      legend: {
        display: true
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

  const config: ChartConfiguration = {
    type: "line",
    data: data,
    options: lineOptions as ChartOptions
  };

  console.log(config);

  return config;
}

export function defaultPieGraph() {
  const data: ChartData = {
    labels: [
      "Food",
      "Transportation",
      "Utilities",
      "Housing",
      "Clothing",
      "Medical/Insurence",
      "Household Items"
    ],
    datasets: [
      {
        data: [418, 120, 250, 1500, 55, 150, 44],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)"
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)"
        ]
      }
    ]
  };

  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: "Spending for March"
      },
      legend: {
        display: false
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

  const config: ChartConfiguration = {
    type: "pie",
    data: data,
    options: pieOptions as ChartOptions
  };

  console.log(config);

  return config;
}

export function defaultPolarGraph() {
  const data = {
    labels: [
      "Food",
      "Transportation",
      "Utilities",
      "Housing",
      "Clothing",
      "Medical/Insurence",
      "Household Items"
    ],
    datasets: [
      {
        label: "Spending for March",
        data: [418, 120, 250, 391, 55, 150, 44],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)"
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)"
        ]
      }
    ]
  };

  const polarOptions = {
    plugins: {
      title: {
        display: true,
        text: "Spending for March"
      },
      legend: {
        display: false
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

  const config: ChartConfiguration = {
    type: "polarArea",
    data: data,
    options: polarOptions as ChartOptions
  };

  console.log(config);

  return config;
}
