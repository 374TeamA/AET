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
  isSplit: boolean;
}

export default function Transactions() {
  const params = useParams();
  const accountId: string | undefined = params.id;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
        <CategorySelector
          rowData={params.row as GridRowModel}
          defaultValue={params.value as string}
          updateTransaction={updateTransaction}
        />
      )
    },
    {
      field: "isSplit",
      headerName: "Split",
      width: 50,
      renderCell: (params: GridCellParams) => (
        <p>{(params.value as boolean) ? "Yes" : "No"}</p>
      )
    }
  ];
  const formatDate = (date: string) => {
    // Customize the date format as per your needs
    return format(new Date(date), "yyyy-MM-dd"); // Example format
  };
  useEffect(() => {
    getAllTransactions(accountId as string).then((transactions) => {
      setTransactions(transactions);
    });
  }, [accountId]);

  const updateTransaction = (updatedRow: GridRowModel) => {
    // Implement your update logic here, e.g., make an API request to update the data
    //console.log("Row updated:", updatedRow);
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
      const isSplit = transaction.details.length > 1;
      transaction.details.forEach((detail, index) => {
        flatTransactions.push({
          id: transaction.id + index,
          index: index,
          transactionID: transaction.id,
          date: transaction.date,
          merchant: transaction.merchant,
          amount: detail.amount,
          category: detail.category,
          import: transaction.import,
          isSplit: isSplit
        });
      });
    });
    setFlatTransactions(flatTransactions);
  }, [transactions]);
  return (
    <Box style={{ height: "100%", width: "86dvw", padding: "0px" }}>
      {accountId != "undefined" ? (
        <DataGrid columns={columns} rows={flatTransactions} />
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  );
}

const CategorySelector: React.FC<{
  rowData: GridRowModel;
  defaultValue: string;
  updateTransaction: (row: GridRowModel) => void;
}> = ({ rowData, defaultValue, updateTransaction }) => {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>(defaultValue);
  const categories = useContext(CategoryContext);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    // Update the DataGrid row data with the new value
    rowData.customSelectValue = newValue;
    setSelectedCategoryId(newValue);
    // Call your update function here with the updated data
    updateTransaction(rowData);
  };
  if (categories.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <FormControl style={{ width: "100%" }}>
      <Select
        value={selectedCategoryId}
        onChange={handleSelectChange}
        style={{
          backgroundColor: `${
            categories.find((cat) => cat.name == selectedCategoryId)?.color ||
            "white"
          }`,
          color: "black",
          width: "100%"
        }}
      >
        {categories.map((category, index) => {
          return (
            <MenuItem
              key={index}
              style={{ backgroundColor: `${category.color}` }}
              value={category.name}
            >
              {category.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
