import { useState, useRef } from "react";
import { Transaction, TransactionDetail } from "../types/transaction";
import CustomPopup from "./Popup";
import { Button, MenuItem, Select, TextField } from "@mui/material";

export default function Split({
  transaction,
  onClose,
  categories
}: {
  transaction: Transaction;
  onClose: (transaction: Transaction) => void;
  categories: {
    [key: string]: string;
  };
}) {
  //   const categories = useContext(CategoryContext);
  const [isOpen, setIsOpen] = useState(true);
  const [total, setTotal] = useState<number>(
    transaction.details.reduce(
      (accumulator: number, detail: TransactionDetail) =>
        accumulator + detail.amount,
      0 // Initial value
    )
  );
  const [splits, setSplits] = useState<TransactionDetail[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("Default");
  const [amount, setAmount] = useState<number>(total);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const handleClose = () => {
    onClose(transaction);
    setIsOpen(false);
  };
  const handleChangeValue = (total: number) => {
    // Access the input element using the ref
    const inputElement = textFieldRef.current;

    // Check if the input element exists
    if (inputElement) {
      // Change the value of the input
      inputElement.value = (total / 100).toFixed(2);
    }
  };
  return (
    <CustomPopup onClose={handleClose} isOpen={isOpen}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "0.5rem"
          }}
        >
          <h4 style={{ fontSize: "1.5rem" }}>Split "{transaction.merchant}"</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center"
          }}
        >
          <TextField
            defaultValue={(amount / 100).toFixed(2)}
            size="small"
            inputRef={textFieldRef}
            style={{ margin: "0.5rem" }}
            onBlur={(e) => {
              if (e.target.value === "") {
                return;
              }
              if (parseFloat(e.target.value) > total / 100) {
                setAmount(total);
              } else {
                setAmount(parseFloat(e.target.value) * 100);
              }
            }}
          />
          <Select
            // variant="contained"
            style={{
              width: "10rem",
              fontSize: "0.9rem",
              margin: "2px",
              //make the background colour the selected item's colour

              backgroundColor: `${categories[currentCategory] || "black"}`,
              color: "white"
            }}
            onChange={(e) => {
              setCurrentCategory(e.target.value);
            }}
            size="small"
            value={currentCategory}
          >
            <MenuItem
              style={{
                backgroundColor: `${categories[currentCategory] || "black"}`,
                color: "white"
              }}
              value={currentCategory}
            >
              {currentCategory}
            </MenuItem>
            {Object.keys(categories).map((category, index) => {
              if (category !== currentCategory) {
                return (
                  <MenuItem
                    key={index}
                    style={{ backgroundColor: `${categories[category]}` }}
                    value={category}
                  >
                    {category}
                  </MenuItem>
                );
              }
            })}
          </Select>
          <Button
            variant="outlined"
            style={{ margin: "0.1rem" }}
            onClick={() => {
              const newSplits = [...splits];
              newSplits.push({
                amount: amount,
                category: currentCategory
              });
              setSplits(newSplits);
              setTotal(total - amount);
              setAmount(total - amount);
              handleChangeValue(total - amount);
            }}
          >
            Add
          </Button>
        </div>
        <div style={{ width: "100%" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ border: "1px solid lightgrey" }}>
                <th style={{ padding: "0.5rem" }}>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {splits.map((split, index) => {
                return (
                  <tr key={index}>
                    <td style={{ padding: "0.5rem" }}>
                      ${(split.amount / 100).toFixed(2)}
                    </td>
                    <td>{split.category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {splits.length > 0 && (
          <Button
            variant={splits.length > 1 ? "contained" : "outlined"}
            disabled={splits.length == 0}
            onClick={() => {
              //Save the new transaction with the new details menu, if any balance is remaining int he total then make a new default detail item with the remaining balance
              const newTransaction = { ...transaction };
              newTransaction.details = splits;
              if (total > 0) {
                newTransaction.details.push({
                  amount: total,
                  category: "Default"
                });
              }
              onClose(newTransaction);
            }}
          >
            Save
          </Button>
        )}
      </div>
    </CustomPopup>
  );
}
