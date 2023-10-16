import { Button, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Transaction, TransactionDetail } from "../../types/transaction";
import { useContext, useState } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import Split from "../Split";
import { saveTransaction } from "../../database/transactions";
interface ItemProps {
  transaction: Transaction;
  updateTransactions: (transaction: Transaction) => void;
}

function CategoryPicker(props: {
  transactionDetail: TransactionDetail;
  onChange: (e: SelectChangeEvent<string>,index:number) => void;
  index: number;
}) {
  const categories = useContext(CategoryContext);
  const [currentCategory, setCurrentCategory] = useState<string>(
    props.transactionDetail.category
  );
  return (
    <div
    style={{
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center"
    }}
    >
      <div style={{ width: "15%" }}>
        <p>${(props.transactionDetail.amount / 100).toFixed(2)}</p>
      </div>
      <div>
        <Select
          // variant="contained"
          style={{
            width: "10rem",
            fontSize: "0.9rem",
            margin: "2px",
            //make the background colour the selected item's colour
            backgroundColor: `${categories.find(cat=>cat.name == currentCategory)?.color || "white"}`,
          }}
          onChange={(e) => {
            setCurrentCategory(e.target.value);
            props.onChange(e,props.index);
          }}
          size="small"
          value={currentCategory}
        >
          <MenuItem
            style={{
              width: "10rem",
              fontSize: "0.9rem",
              margin: "2px",
              //make the background colour the selected item's colour

              backgroundColor: `${
                categories.find(cat=>cat.name == currentCategory)?.color|| "white"
              }`,
            }}
            value={currentCategory} 
          >
            {currentCategory}
          </MenuItem>
          {categories.map((category, index) => {
            if (category.name !== currentCategory) {
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
      </div>
    </div>
  );
}

export default function Item({
  transaction,
  updateTransactions
}: ItemProps) {

  //const categories = React.useContext(CategoryContext);
  const [splitMenuOpen, setSplitMenuOpen] = useState(false);
  const [itemTransaction, setItemTransaction] =
    useState<Transaction>(transaction);
  const handleCategoryChange = (
    e: SelectChangeEvent<string>,
    index: number
  ) => {
    console.log(
      "change",
      e.target.value,
      transaction.details[index].category,
      index
    );
    // Store the update in the database.
    transaction.details[index].category = e.target.value as string;
    updateTransactions(transaction);
  };

  const handleClose = (transaction: Transaction) => {
    saveTransaction(transaction);
    setItemTransaction(transaction);
    updateTransactions(transaction);
    setSplitMenuOpen(false);
  };

  const handleOpen = () => {
    console.log("open");
    setSplitMenuOpen(true);
  };

  return (
    <>
      {splitMenuOpen && (
        <Split
          transaction={itemTransaction}
          onClose={handleClose}
        />
      )}
      <div
        style={{
          margin: "0.5rem",
          padding: "0.5rem",
          borderRadius: "5px",
          backgroundColor: "white",
          border: "1px solid lightgrey"
        }}
      >
        <div>
          <p>{itemTransaction.date.toLocaleDateString()}</p>
        </div>
        <div
          style={{
            minHeight: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ width: "40%" }}>
            <p>{itemTransaction.merchant}</p>
          </div>
          {/* For each details items */}
          <div style={{ display: "block", width: "40%" }}>
            {itemTransaction.details.map((detail, index) => (
              <CategoryPicker
                index={index}
                key={index}
                transactionDetail={detail}
                onChange={handleCategoryChange}
              ></CategoryPicker>
            ))}
          </div>
          <Button
            variant="outlined"
            style={{ width: "15%", fontSize: "0.9rem" }}
            onClick={handleOpen}
          >
            Split
          </Button>
        </div>
      </div>
    </>
  );
}
