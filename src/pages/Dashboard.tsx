// import React from 'react'
import { saveTransaction } from "../database/transactions";
import { Transaction } from "../types/transaction";

//TODO: Set it up so if there is no accounts the dashboard prompts to create a new account 
export default function Dashboard() {
  return (
    <div>Dashboard
      <button type="button" onClick={() => {
        const t: Transaction = {
          id: "01",
          date: new Date("2023/09/29"),
          merchant: "Warehouse",
          details: [{
            amount: 23,
            category: "Clothing"
          }]
        };
        saveTransaction(t)}}>Click Me!</button>
    </div>
  )
}
