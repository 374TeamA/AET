import { Dispatch, SetStateAction, createContext } from "react";
import { Account } from "../types/account";

// Default accounts (only used for testing purposes)
// create a map with all the default categories (and their displayName the same as their ID)
const defaultAccounts: Account[] = 
[
  "Default Accounts",
].map(x=>({id:x,name:x}))

// The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them
// (React Docs https://legacy.reactjs.org/docs/context.html#reactcreatecontext)
export const AccountContext = createContext<Account[]>(defaultAccounts);

export const AccountUpdaterContext = createContext<Dispatch<SetStateAction<Account[]>>>(accounts=>accounts)