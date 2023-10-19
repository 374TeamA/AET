import { useState, useRef, useContext } from "react";
import { Transaction, TransactionDetail } from "../types/transaction";
import CustomPopup from "./Popup";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { CategoryContext } from "../context/CategoryContext";

export default function Split({
  transaction,
  onClose
}: {
  transaction: Transaction;
  onClose: (transaction?: Transaction) => void;
}) {
  const categories = useContext(CategoryContext);
  const [isOpen, setIsOpen] = useState(true);
  const [total, setTotal] = useState<number>(
    transaction.details.reduce(
      (accumulator: number, detail: TransactionDetail) =>
        accumulator + detail.amount,
      0 // Initial value
    )
  );
  const originalTransaction = { ...transaction };
  const [splits, setSplits] = useState<TransactionDetail[]>([]);
  const [currentCategoryId, setCurrentCategoryId] =
    useState<string>("Un-Categorised");
  const [amount, setAmount] = useState<number>(total);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const handleClose = () => {
    if (JSON.stringify(originalTransaction) != JSON.stringify(transaction)) {
      onClose(transaction);
    } else {
      onClose();
    }
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

          <Select // TODO: merge this with the Category Picker in Item.tsx, and in the transactions table as well if possible (they all do more or less the same thing)
            // variant="contained"
            style={{
              width: "10rem",
              fontSize: "0.9rem",
              margin: "2px",
              //make the background colour the selected item's colour

              backgroundColor: `${
                categories.find((cat) => cat.name == currentCategoryId)
                  ?.color || "white"
              }`
            }}
            onChange={(e) => {
              setCurrentCategoryId(e.target.value);
            }}
            size="small"
            value={currentCategoryId}
          >
            <MenuItem
              style={{
                backgroundColor: `${
                  categories.find((cat) => cat.name == currentCategoryId)
                    ?.color || "white"
                }`
              }}
              value={currentCategoryId}
            >
              {categories.find((cat) => cat.name == currentCategoryId)?.name}
            </MenuItem>
            {categories.map((category, index) => {
              if (category.id !== currentCategoryId) {
                return (
                  <MenuItem
                    key={index}
                    style={{ backgroundColor: `${category.color}` }}
                    value={category.name}
                  >
                    {category.name}
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
                category: currentCategoryId
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
          <table style={{ width: "100%", marginBottom: "1rem" }}>
            <thead>
              <tr style={{ border: "1px solid lightgrey" }}>
                <th style={{ padding: "0px", width: "1rem" }}></th>
                <th style={{ padding: "0.5rem" }}>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {splits.map((split, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Button
                        style={{ width: "2rem", padding: "0px" }}
                        onClick={() => {
                          setTotal(total + splits[index].amount);
                          setAmount(total + splits[index].amount);
                          handleChangeValue(total + splits[index].amount);
                          splits.splice(index, 1);
                          setSplits([...splits]);
                        }}
                      >
                        X
                      </Button>
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      ${(split.amount / 100).toFixed(2)}
                    </td>
                    <td
                      style={{
                        backgroundColor: `${
                          categories.find((cat) => cat.name == split.category)
                            ?.color || "white"
                        }`
                      }}
                    >
                      {
                        categories.find((cat) => cat.name == split.category)
                          ?.name
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                    category: "Un-Categorised"
                  });
                }
                onClose(newTransaction);
              }}
            >
              Save
            </Button>
          )}
          <Button style={{ color: "red" }} onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </CustomPopup>
  );
}
