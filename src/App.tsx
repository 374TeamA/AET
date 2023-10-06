import Root from "./layout/Root.tsx";
import {
  AccountContext,defaultAccounts
} from "./context/AccountsContext";
import {
  CategoryContext,defaultCategories
} from "./context/CategoryContext";
//import { BrowserRouter as Router } from "react-router-dom";
import Routers from "./Routes.tsx";
// TODO: Create a context that stores the setState contexts for the accounts and categories so that we can access them.
function App() {
  return (

    <Root>
      <AccountContext.Provider value={defaultAccounts}>
        <CategoryContext.Provider value={defaultCategories}>
          <Routers />
        </CategoryContext.Provider>
      </AccountContext.Provider>
    </Root>
  );
}

export default App;
