// import { useState } from "react";
import { AccountsProvider } from "./context/AccountsContext.tsx";
import { CategoryProvider } from "./context/CategoryContext.tsx";
import Root from "./layout/Root.tsx";
//import { BrowserRouter as Router } from "react-router-dom";
import Routers from "./Routes.tsx";
//import { Account } from "./types/account.ts";
function App() {
  /* 
  Setup AccountContext (Storing the list of users' accounts)
  */
  // state to store the list of categories
  //const [accountList, setAccountList] = useState<Account[]>(defaultAccounts);

  /* 
  Setup CategoryContext (Storing the list of current categories)
  */

  return (
    <AccountsProvider>
      <CategoryProvider>
        <Root>
          <Routers />
        </Root>
      </CategoryProvider>
    </AccountsProvider>
  );
}

export default App;
