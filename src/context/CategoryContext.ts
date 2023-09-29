import { createContext } from "react";

export type CategoryList = Array<string>;

export const defaultCategories: CategoryList = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Clothing",
  "Medical/Healthcare",
  "Insurance",
  "Household Items",
  "Ignore"
];

// The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them
// (React Docs https://legacy.reactjs.org/docs/context.html#reactcreatecontext)
export const CategoryContext = createContext<CategoryList>(defaultCategories);
