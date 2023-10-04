//import React from "react";

import { ChartType } from "chart.js";

export type GraphConfig = {
  startDate: Date;
  endDate: Date;
  length: number;
  categories: string[];
  type: ChartType;
  favourite: boolean;
  update: boolean;
  allTransactions: boolean;
};
