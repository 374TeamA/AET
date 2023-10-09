import { useEffect, useState, useContext } from "react";
import { Import, Transaction } from "../../types/transaction";
import "./Table.css";
import Column from "./Column";
import { saveImport } from "../../database/imports";
import { saveTransaction } from "../../database/transactions";
import { CategoryContext } from "../../context/CategoryContext";
import { useParams } from "react-router-dom";
interface TableProps {
  importData: Import | undefined;
}
export default function Table({ importData }: TableProps) {
  const params = useParams();
  const accountId: string | undefined = params.id;

  const categories = useContext(CategoryContext);
  const [categorised, setCategorised] = useState<Transaction[]>(
    importData?.transactions?.filter((transaction) =>
      transaction.details.some(
        (detail) =>
          typeof detail === "object" &&
          (detail as { amount: number; category: string }).category !==
            "Default"
      )
    ) ?? []
  );
  const [uncategorised, setUncategorised] = useState<Transaction[]>(
    importData?.transactions?.filter((transaction) =>
      transaction.details.some(
        (detail) =>
          typeof detail === "object" &&
          (detail as { amount: number; category: string }).category == "Default"
      )
    ) ?? []
  );
  //generate a new random colour for each category
  const [categoryColors, setCategoryColors] = useState<{
    [key: string]: string;
  }>({});
  useEffect(() => {
    //save the import to the database
    console.log("Saving import to database");
    if (importData) {
      saveImport(importData);
      for (const transaction of importData.transactions) {
        transaction.account = accountId as string;
        saveTransaction(transaction);
      }
    }
  }, [importData,accountId]); // TODO : validate that this doesn't break with the extra dependencies
  const updateTransactions = (transaction: Transaction) => {
    //remove transaction from uncategorized and add it to categorized
    console.log(`Updating transaction ${transaction.id}`);
    const newUncategorized = [...uncategorised];
    const newCategorized = [...categorised];
    const index = newUncategorized.findIndex(
      (item) => item.id === transaction.id
    );
    if(index != -1){
      newUncategorized.splice(index, 1);
      setUncategorised(newUncategorized);
      newCategorized.push(transaction);
      setCategorised(newCategorized);
    }

    
  };
  useEffect(() => {
    //console.log(importData);
  }, []);

  useEffect(() => {
    const newCategoryColors: { [key: string]: string } = {};
    categories.forEach((category) => {
      newCategoryColors[category.name] = `#${Math.floor(
        Math.random() * 16777215
      ).toString(16)}`;
    });
    setCategoryColors(newCategoryColors);
  }, [categories]);

  return (
    <div className="display-flex">
      <Column
        title="Categorised"
        items={categorised}
        categories={categoryColors}
        updateTransactions={updateTransactions}
      />
      {/* Categorised transactions list */}
      <Column
        title="Un-categorised"
        items={uncategorised}
        categories={categoryColors}
        updateTransactions={updateTransactions}
      />
      {/* Un-Categorised transactions list */}
    </div>
  );
}
