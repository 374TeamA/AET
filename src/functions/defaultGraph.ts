import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  TooltipItem
} from "chart.js";

/**
 * Generates the default configuration for a bar graph.
 *
 * @returns {ChartConfiguration} The default configuration for a bar graph.
 */
export function defaultBarGraph(): ChartConfiguration {
  // Data for the bar graph, including labels, datasets, and styling.
  const data: ChartData = {
    labels: [
      "Food",
      "Transportation",
      "Utilities",
      "Housing",
      "Clothing",
      "Medical/Insurance",
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

  // Options for the bar graph, including scales, title, legend, and tooltip settings.
  const barOptions: ChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Custom tick formatting for values greater than or equal to 1000.
          callback: function (value: string | number): string {
            if (typeof value === "number" && value >= 1000) {
              return (
                "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            } else if (typeof value === "string" && parseInt(value) >= 1000) {
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
        text: "Spending for March" // Title text for the graph.
      },
      legend: {
        display: false // Hide the legend.
      },
      tooltip: {
        callbacks: {
          // Custom tooltip label formatting as currency (USD).
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

  // Configuration for the bar graph, combining data and options.
  const config: ChartConfiguration = {
    type: "bar",
    data: data,
    options: barOptions
  };

  return config;
}

/**
 * Generates the default configuration for a line graph.
 *
 * @returns {ChartConfiguration} The default configuration for a line graph.
 */
export function defaultLineGraph(): ChartConfiguration {
  // Data for the line graph, including labels, datasets, and styling.
  const data: ChartData = {
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

  // Options for the line graph, including scales, title, legend, and tooltip settings.
  const lineOptions: ChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Custom tick formatting for values greater than or equal to 1000.
          callback: function (value: string | number): string {
            if (typeof value === "number" && value >= 1000) {
              return (
                "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            } else if (typeof value === "string" && parseInt(value) >= 1000) {
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
        text: "Spending for a week for Food and Clothing" // Title text for the graph.
      },
      legend: {
        display: true // Show the legend.
      },
      tooltip: {
        callbacks: {
          // Custom tooltip label formatting as currency (USD).
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

  // Configuration for the line graph, combining data and options.
  const config: ChartConfiguration = {
    type: "line",
    data: data,
    options: lineOptions
  };

  return config;
}

/**
 * Generates the default configuration for a pie graph.
 *
 * @returns {ChartConfiguration} The default configuration for a pie graph.
 */
export function defaultPieGraph(): ChartConfiguration {
  // Data for the pie graph, including labels, datasets, and styling.
  const data: ChartData = {
    labels: [
      "Food",
      "Transportation",
      "Utilities",
      "Housing",
      "Clothing",
      "Medical/Insurance",
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

  // Options for the pie graph, including title, legend, and tooltip settings.
  const pieOptions: ChartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Spending for March" // Title text for the graph.
      },
      legend: {
        display: false // Hide the legend.
      },
      tooltip: {
        callbacks: {
          // Custom tooltip label formatting as currency (USD).
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

  // Configuration for the pie graph, combining data and options.
  const config: ChartConfiguration = {
    type: "pie",
    data: data,
    options: pieOptions
  };

  return config;
}

/**
 * Generates the default configuration for a polar area graph.
 *
 * @returns {ChartConfiguration} The default configuration for a polar area graph.
 */
export function defaultPolarGraph(): ChartConfiguration {
  // Data for the polar area graph, including labels, datasets, and styling.
  const data: ChartData = {
    labels: [
      "Food",
      "Transportation",
      "Utilities",
      "Housing",
      "Clothing",
      "Medical/Insurance",
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

  // Options for the polar area graph, including title, legend, and tooltip settings.
  const polarOptions: ChartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Spending for March" // Title text for the graph.
      },
      legend: {
        display: false // Hide the legend.
      },
      tooltip: {
        callbacks: {
          // Custom tooltip label formatting as currency (USD).
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

  // Configuration for the polar area graph, combining data and options.
  const config: ChartConfiguration = {
    type: "polarArea",
    data: data,
    options: polarOptions
  };

  return config;
}
