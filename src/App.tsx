import { useEffect, useState } from "react";
import { AccountContext, AccountUpdaterContext } from "./context/AccountsContext.ts";
import { CategoryContext, CategoryList, CategoryUpdaterContext } from "./context/CategoryContext.ts";
import Root from "./layout/Root.tsx";
//import { BrowserRouter as Router } from "react-router-dom";
import Routers from "./Routes.tsx";
import { Account } from "./types/account.ts";
import { getAccounts } from "./database/accounts.ts";
import { getCategories } from "./database/categories.ts";
function App() {
  /* 
  Setup AccountContext (Storing the list of users' accounts)
  */
  // state to store the list of categories
  const [accountList, setAccountList] =
    useState<Account[]>([]);
  
  /* 
  Setup CategoryContext (Storing the list of current categories)
  */
  const [categoryList, setCategoryList] =
  useState<CategoryList>([]);

  // Get categories and accounts from database on load
  useEffect(() => {
    getAccounts().then((accounts) => {
      setAccountList(accounts);
    });
    getCategories().then((categories) => {
      setCategoryList(categories);
    });
  }, []);

  return (
    <AccountContext.Provider value={accountList}>
      <AccountUpdaterContext.Provider value={setAccountList}>
        <CategoryContext.Provider value={categoryList}>
          <CategoryUpdaterContext.Provider value={setCategoryList}>
            <Root>
              <Routers />
            </Root>
          </CategoryUpdaterContext.Provider>
        </CategoryContext.Provider>
      </AccountUpdaterContext.Provider>
    </AccountContext.Provider>
  );
}

export default App;
