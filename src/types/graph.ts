//import React from "react";

import { ChartType } from "chart.js";

export type GraphConfig = {
  id: string;
  startDate: Date;
  endDate: Date;
  length: number;
  categories: string[];
  type: ChartType;
  favourite: boolean;
  update: boolean;
  allTransactions: boolean;
};
