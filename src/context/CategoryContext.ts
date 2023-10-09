import { Dispatch, SetStateAction, createContext } from "react";
import { Category } from "../types/category";

export type CategoryList = Array<Category>;

// create a map with all the default categories (and their name the same as their ID). This is used For testing only.
const defaultCategories: CategoryList = //await getCategories();
[
  "Test Categories",
  "Transportation",
  "Housing",
  "Utilities",
  "Clothing",
  "Medical",
  "Insurance",
  "Household Items",
  "Ignore"
].map(x=>({id:x,name:x}))

// The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them
// (React Docs https://legacy.reactjs.org/docs/context.html#reactcreatecontext)
export const CategoryContext = createContext<CategoryList>(defaultCategories);

// We also need to create a context that lets you pass "setCategories" to a child element
export const CategoryUpdaterContext = createContext<Dispatch<SetStateAction<CategoryList>>>((categoryList)=>categoryList)