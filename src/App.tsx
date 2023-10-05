import { useState } from "react";
import { AccountContext, AccountUpdaterContext, defaultAccounts } from "./context/AccountsContext.ts";
import { CategoryContext, CategoryList, CategoryUpdaterContext, defaultCategories } from "./context/CategoryContext.ts";
import Root from "./layout/Root.tsx";
//import { BrowserRouter as Router } from "react-router-dom";
import Routers from "./Routes.tsx";
import { Account } from "./types/account.ts";
function App() {
  /* 
  Setup AccountContext (Storing the list of users' accounts)
  */
  // state to store the list of categories
  const [accountList, setAccountList] =
    useState<Account[]>(defaultAccounts);
  
  /* 
  Setup CategoryContext (Storing the list of current categories)
  */
  const [categoryList, setCategoryList] =
  useState<CategoryList>(defaultCategories);

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
