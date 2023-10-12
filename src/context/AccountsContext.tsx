import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from "react";
import { Account } from "../types/account";
import { getAccounts } from "../database/accounts";

// Load in the default accounts
// create a map with all the default categories (and their displayName the same as their ID)
//export const defaultAccounts: Account[] = await getAccounts();
/*[
  "Westpac",
].map(x=>({id:x,name:x}))*/

// The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them
// (React Docs https://legacy.reactjs.org/docs/context.html#reactcreatecontext)
export const AccountContext = createContext<Account[] | null>(null);

export const AccountUpdaterContext = createContext<
  Dispatch<SetStateAction<Account[] | null>>
>((accounts) => accounts);

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  useEffect(() => {
    console.time("getAccounts");
    getAccounts().then((accounts) => {
      setAccounts(accounts);
    });
    console.timeEnd("getAccounts");
  }, []);

  return (
    <AccountContext.Provider value={accounts}>
      <AccountUpdaterContext.Provider value={setAccounts}>
        {children}
      </AccountUpdaterContext.Provider>
    </AccountContext.Provider>
  );
}
