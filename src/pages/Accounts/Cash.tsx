import {
  Button,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useContext, useState } from "react";
import HelpDialog from "../../components/HelpDialog";
import { CategoryContext } from "../../context/CategoryContext";
import { saveTransaction } from "../../database/transactions";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../../types/transaction";
import Transactions from "./Transactions";

export default function Cash() {
  const categories = useContext(CategoryContext);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Un-Categorised");
  const [id, setId] = useState(uuidv4); // this is used to force the transactions to re-render (and re-fetch everything from the db). Not the best, but works for the interim. TODO: make it better - (prop drilling?)

  const handleSave = () => {
    const total = Math.floor(parseFloat(amount) * 100);
    const transaction: Transaction = {
      id: id,
      account: "CASH",
      import: "CASH",
      hash: id,
      date: new Date(date),
      merchant: description,
      totalAmount: total,
      details: [
        {
          amount: total,
          category: category
        }
      ]
    };
    saveTransaction(transaction);
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Un-Categorised");
    setId(uuidv4());
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ p: 1 }}>
          Manual Entry
        </Typography>
        <HelpDialog title="Manual Entry">
          <div>
            To record your spending using cash, enter the date, description,
            amount, and category. Press "Add" to save your new entry.
          </div>
          <br />
          <div>
            Your list of previously added transactions will be shown below.
            <br />
          </div>
          <div>
            <br />
            ATM Withdrawals will show in your bank account, so adding cash
            transactions that are from ATM withdrawals are not necessary here.
          </div>
        </HelpDialog>
      </Stack>
      <Typography>
        Record spending outside of a bank account, such as when you pay for
        something using cash.
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ p: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={2}>
          <TextField
            variant="outlined"
            type="date"
            value={date}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setDate(e?.target.value);
              //console.log(e.target.value);
            }}
          ></TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Description"
            variant="outlined"
            sx={{ width: "100%" }}
            value={description}
            onChange={(e) => setDescription(e?.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Amount"
            variant="outlined"
            type="number"
            sx={{ width: "100%" }}
            value={amount}
            onChange={(e) => setAmount(e?.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Select
            value={category}
            onChange={(e) => setCategory(e?.target.value)}
            sx={{ width: "100%" }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6} md={2}>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={handleSave}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Transactions key={id} />
    </>
  );
}
