import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getAllTransactions
  // saveTransaction
} from "../../database/transactions";
import { useParams } from "react-router-dom";
import { FormControl, Select, MenuItem } from "@mui/material";
import { format } from "date-fns";
import { getCategories } from "../../database/categories";
import { Category } from "../../types/category";
// TODO: Basic display for a list of transactions

interface FlatTransaction {
  id: string;
  date: Date;
  merchant: string;
  amount: number;
  category: string;
  import: string;
}

export default function Transactions() {
  const params = useParams();
  const accountId: string | undefined = params.id;
  const [transactions, setTransactions] = useState<FlatTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
      field: "category",
      headerName: "Category",
      flex: 1,
      renderCell: (params) => (
        <SelectCell
          categories={categories}
          value={params.value}
          onSelectionChange={(newValue: string) =>
            handleSelectionChange(params.row.id, newValue)
          }
        />
      )
    },
    {
      field: "amount",
      headerName: "Amount",
      valueFormatter: ({ value }) => `$${value.toFixed(2)}`,
      flex: 0.5,
      align: "right"
    }
    // { field: "import", headerName: "Import", flex: 2 }
  ];
  const formatDate = (date: string) => {
    // Customize the date format as per your needs
    return format(new Date(date), "yyyy-MM-dd"); // Example format
  };

  const handleSelectionChange = (id: string, newValue: string) => {
    //update the transaction with the new category
    const newTransactions = [...transactions];
    const index = newTransactions.findIndex((item) => item.id === id);
    newTransactions[index].category = newValue;
    setTransactions(newTransactions);
  };
  useEffect(() => {
    const getDBCategories = async () => {
      const categories: Category[] = await getCategories();
      setCategories(categories);
    };
    getDBCategories();
    getAllTransactions(accountId as string).then((transactions) => {
      //setTransactions(transactions);
      //flatten all the transactions
      const flatTransactions: FlatTransaction[] = [];
      for (const transaction of transactions) {
        for (const detail of transaction.details) {
          if (typeof detail === "object") {
            flatTransactions.push({
              id: transaction.id,
              date: transaction.date,
              merchant: transaction.merchant,
              amount: detail.amount,
              category: detail.category,
              import: transaction.import
            });
          }
        }
      }
      setTransactions(flatTransactions);
    });
  }, []);
  return (
    <Box style={{ height: "77vh" }}>
      <DataGrid columns={columns} rows={transactions} />
    </Box>
  );
}
interface SelectCellProps {
  value: string;
  onSelectionChange: (newValue: string) => void;
  categories: Category[];
}
function SelectCell({ value, onSelectionChange, categories }: SelectCellProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    onSelectionChange(newValue);
  };

  return (
    <FormControl variant="standard" style={{ width: "100%" }}>
      <Select value={value} onChange={handleChange} size="small">
        <MenuItem value="Default">Default</MenuItem>
        {categories.map((category) => (
          <MenuItem value={category.name}>{category.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
