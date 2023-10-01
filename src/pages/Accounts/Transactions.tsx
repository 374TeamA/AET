import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

// TODO: Basic display for a list of transactions
const columns: GridColDef[] = [
  { field: "id", headerName: "ID" },
  { field: "date", headerName: "Date" },
  { field: "description", headerName: "Description", flex: 1 },
  { field: "amount", headerName: "Amount" }
];

export default function Transactions() {
  return (
    <Box style={{ height: "77vh" }}>
      <DataGrid
        columns={columns}
        rows={[
          {
            id: 1,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 2,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 3,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 4,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 5,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 6,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 7,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 8,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 9,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 10,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 11,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 12,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 13,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 14,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          },
          {
            id: 15,
            Date: "2023/09/01",
            description: "This is a test",
            amount: "123"
          }
        ]}
      />
    </Box>
  );
}
