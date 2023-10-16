import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from "react";
import { Category } from "../types/category";
import { getCategories } from "../database/categories";

export type CategoryList = Array<Category>;

// create a map with all the default categories (and their name the same as their ID)
//export const defaultCategories: CategoryList = await getCategories();
/*[
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Clothing",
  "Medical",
  "Insurance",
  "Household Items",
  "Ignore"
].map(x=>({id:x,name:x}))*/

// The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them
// (React Docs https://legacy.reactjs.org/docs/context.html#reactcreatecontext)
export const CategoryContext = createContext<Category[]>([]);

// We also need to create a context that lets you pass "setCategories" to a child element
export const CategoryUpdaterContext = createContext<
  Dispatch<SetStateAction<Category[]>>
>((categoryList) => categoryList);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryList>([]);
  useEffect(() => {
    console.log("Getting categories");
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {}, [categories]);

  return (
    <CategoryContext.Provider value={categories}>
      <CategoryUpdaterContext.Provider value={setCategories}>
        {children}
      </CategoryUpdaterContext.Provider>
    </CategoryContext.Provider>
  );
}
