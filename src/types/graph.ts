//import React from "react";

import { ChartType } from "chart.js";
import { FlattenedTransaction } from "./transaction";

export type GraphConfig = {
  id: string;
  startDate: Date;
  endDate: Date;
  length: number;
  categories: string[];
  accounts: string[];
  type: ChartType;
  favourite: boolean;
  update: boolean;
  allTransactions: boolean;
};

export type GraphData = {
  graphConfig: GraphConfig;
  data: FlattenedTransaction[];
  canvasID: string;
};
