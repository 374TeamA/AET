import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowModel
} from "@mui/x-data-grid";
import { Box, FormControl, SelectChangeEvent } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import {
  getAllTransactions
  // saveTransaction
} from "../../database/transactions";
import { useParams } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import { format } from "date-fns";
import { Transaction } from "../../types/transaction";
import { Category } from "../../types/category";
import { CategoryContext } from "../../context/CategoryContext";
import { saveTransaction } from "../../database/transactions";
// TODO: Basic display for a list of transactions

interface FlatTransaction {
  id: string;
  index: number;
  transactionID: string;
  date: Date;
  merchant: string;
  amount: number;
  category: string;
  import: string;
}

export default function Transactions() {
  const params = useParams();
  const accountId: string | undefined = params.id;
  const categoriesFromDB = useContext(CategoryContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [options, setOptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log("Creating options");
    //create a random colour for each category
    const newCategoryColors: { [key: string]: string } = {};
    categories.forEach((category) => {
      newCategoryColors[category.name] = `#${Math.floor(
        Math.random() * 16777215
      ).toString(16)}`;
    });
    console.log(newCategoryColors);
    setOptions(newCategoryColors);
  }, [categories]);

  const [flatTransactions, setFlatTransactions] = useState<FlatTransaction[]>(
    []
  );
  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID",  },
    {
      field: "date",
      headerName: "Date",
      flex: 0.5,
      valueFormatter: ({ value }) => formatDate(value)
    },
    { field: "merchant", headerName: "Merchant", flex: 4 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      valueFormatter: ({ value }) => `$${(value / 100).toFixed(2)}`
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <CustomSelectCell
          rowData={params.row as GridRowModel}
          defaultValue={params.value as string}
          options={options}
          updateTransaction={updateTransaction}
        />
      )
    }
  ];
  const formatDate = (date: string) => {
    // Customize the date format as per your needs
    return format(new Date(date), "yyyy-MM-dd"); // Example format
  };
  useEffect(() => {
    setCategories(categoriesFromDB);
    getAllTransactions(accountId as string).then((transactions) => {
      setTransactions(transactions);
    });
  }, [accountId, categoriesFromDB]);

  const updateTransaction = (updatedRow: GridRowModel) => {
    // Implement your update logic here, e.g., make an API request to update the data
    console.log("Row updated:", updatedRow);
    //find the transaction with the same ID
    const transaction = transactions.find(
      (transaction) => transaction.id === updatedRow.transactionID
    );
    if (transaction) {
      //find the detail with the same index
      const detail = transaction.details[updatedRow.index];
      if (detail) {
        //update the category
        detail.category = updatedRow.customSelectValue;
        //save the transaction to the database
        saveTransaction(transaction);
      }
    }
  };
  useEffect(() => {
    //flatten into flat transactions
    const flatTransactions: FlatTransaction[] = [];
    transactions.forEach((transaction) => {
      transaction.details.forEach((detail, index) => {
        flatTransactions.push({
          id: transaction.id + index,
          index: index,
          transactionID: transaction.id,
          date: transaction.date,
          merchant: transaction.merchant,
          amount: detail.amount,
          category: detail.category,
          import: transaction.import
        });
      });
    });
    setFlatTransactions(flatTransactions);
  }, [transactions]);
  if (options) {
    return (
      <Box style={{ height: "77vh" }}>
        {accountId != "undefined" ? (
          <DataGrid columns={columns} rows={flatTransactions} />
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    );
  } else {
    return <p>Loading...</p>;
  }
}

const CustomSelectCell: React.FC<{
  rowData: GridRowModel;
  defaultValue: string;
  updateTransaction: (row: GridRowModel) => void;
  options: { [key: string]: string };
}> = ({ rowData, defaultValue, updateTransaction, options }) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    rowData.customSelectValue
  );

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;
    // Update the DataGrid row data with the new value
    rowData.customSelectValue = newValue;
    setSelectedValue(newValue);
    // Call your update function here with the updated data
    updateTransaction(rowData);
  };

  useEffect(() => {
    console.log(options);
  }, [options]);
  //check if options has any keys
  if (Object.keys(options).length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <FormControl style={{ width: "100%" }}>
      <Select
        defaultValue={defaultValue}
        onChange={handleSelectChange}
        style={{
          backgroundColor: `${options[selectedValue || defaultValue]}`,
          color: "black",
          width: "100%"
        }}
      >
        <MenuItem
          value={defaultValue}
          style={{ backgroundColor: `${options[defaultValue] || "Black"}` }}
        >
          {defaultValue}
        </MenuItem>
        {Object.keys(options).map((category, index) => {
          if (category !== defaultValue) {
            return (
              <MenuItem
                key={index}
                style={{ backgroundColor: `${options[category]}` }}
                value={category}
              >
                {category}
              </MenuItem>
            );
          }
        })}
      </Select>
    </FormControl>
  );
};
