import { ChartType } from "chart.js";
import { Category } from "./category";

// Graph config type
export type GraphConfig = {
  id: string;
  startDate: Date;
  endDate: Date;
  length: number;
  categories: Category[];
  accounts: string[];
  type: ChartType;
  favourite: number;
  update: boolean;
  allTransactions: boolean;
  groupBy: string;
};
