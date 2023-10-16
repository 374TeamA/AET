import { ChartConfiguration, ChartData, ChartOptions } from "chart.js";

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
      x: {
        grid: {
          drawTicks: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          drawTicks: false
        },
        ticks: {
          display: false
        }
      }
    },
    layout: {
      padding: 10
    },
    plugins: {
      title: {
        display: true,
        text: "Bar Graph", // Title text for the graph.
        font: {
          size: 20,
          weight: "normal"
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
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
      "Sun Jan 01 2023",
      "Mon Jan 02 2023",
      "Tue Jan 03 2023",
      "Wed Jan 04 2023",
      "Thu Jan 05 2023",
      "Fri Jan 06 2023",
      "Sat Jan 07 2023"
    ],
    datasets: [
      {
        label: "Food",
        data: [40, 13, 5, 0, 54, 193, 72],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        pointStyle: false
      },
      {
        label: "Clothing",
        data: [15, 30, 0, 0, 23, 67, 28],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointStyle: false
      },
      {
        label: "Total",
        data: [55, 43, 5, 0, 77, 260, 100],
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        pointStyle: false
      }
    ]
  };

  // Options for the line graph, including scales, title, legend, and tooltip settings.
  const lineOptions: ChartOptions = {
    scales: {
      x: {
        grid: {
          drawTicks: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          drawTicks: false
        },
        ticks: {
          display: false
        }
      }
    },
    layout: {
      padding: 10
    },
    plugins: {
      title: {
        display: true,
        text: "Line Graph", // Title text for the graph.
        font: {
          size: 20,
          weight: "normal"
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
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
    layout: {
      padding: 10
    },
    plugins: {
      title: {
        display: true,
        text: "Pie Graph", // Title text for the graph.
        font: {
          size: 20,
          weight: "normal"
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
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
    scales: {
      r: {
        grid: {
          drawTicks: false
        },
        ticks: {
          display: false
        }
      }
    },
    layout: {
      padding: 10
    },
    plugins: {
      title: {
        display: true,
        text: "Polar Graph", // Title text for the graph.
        font: {
          size: 20,
          weight: "normal"
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
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
