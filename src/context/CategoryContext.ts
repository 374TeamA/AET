import { createContext } from "react";
import { Category } from "../types/category";

export type CategoryList = Array<Category>;

// create a map with all the default categories (and their displayName the same as their ID)
export const defaultCategories: CategoryList = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Clothing",
  "Medical",
  "Insurance",
  "Household Items",
  "Ignore"
].map(x=>({id:x,displayName:x}))

// The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them
// (React Docs https://legacy.reactjs.org/docs/context.html#reactcreatecontext)
export const CategoryContext = createContext<CategoryList>(defaultCategories);
