import { ChartType } from "chart.js";

// Graph config type
export type GraphConfig = {
  id: string;
  startDate: Date;
  endDate: Date;
  length: number;
  categories: string[];
  accounts: string[];
  type: ChartType;
  favourite: number;
  update: boolean;
  allTransactions: boolean;
  groupBy: string;
};
