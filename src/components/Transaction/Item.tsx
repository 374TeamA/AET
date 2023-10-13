import { Button, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Transaction, TransactionDetail } from "../../types/transaction";
import { useState } from "react";
interface ItemProps {
  transaction: Transaction;
  categories: {
    [key: string]: string;
  };
  updateTransactions: (transaction: Transaction) => void;
}

function CategoryPicker(props: {
  transactionDetail: TransactionDetail;
  categories: { [key: string]: string };
  onChange: (e: SelectChangeEvent<string>) => void;
}) {
  const [currentCategory, setCurrentCategory] = useState<string>(
    props.transactionDetail.category
  );
  return (
    <div
      style={{
        display: "flex",
        width: "50%",
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

            backgroundColor: `${props.categories[currentCategory] || "black"}`,
            color: "white"
          }}
          onChange={(e) => {
            setCurrentCategory(e.target.value);
            props.onChange(e);
          }}
          size="small"
          value={currentCategory}
        >
          <MenuItem
            style={{
              backgroundColor: `${
                props.categories[currentCategory] || "black"
              }`,
              color: "white"
            }}
            value={currentCategory}
          >
            {currentCategory}
          </MenuItem>
          {Object.keys(props.categories).map((category, index) => {
            if (category !== currentCategory) {
              return (
                <MenuItem
                  key={index}
                  style={{ backgroundColor: `${props.categories[category]}` }}
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
          style={{ width: "5rem", fontSize: "0.9rem" }}
        >
          Split
        </Button>
      </div>
    </div>
  );
}

export default function Item({
  transaction,
  categories,
  updateTransactions
}: ItemProps) {
  //const categories = React.useContext(CategoryContext);

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    // Store the update in the database.
    transaction.details[0].category = e.target.value as string;
    updateTransactions(transaction);
    // Note, generally you shouldn't modify props directly, because it doesn't actually change the ui.
    // Props are immutable as far as react is concerned. However, it works for the purposes
    // of creating a updated transaction object to send to the database.
  };

  return (
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
        <p>{transaction.date.toLocaleDateString()}</p>
      </div>
      <div
        style={{
          height: "3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ width: "40%" }}>
          <p>{transaction.merchant}</p>
        </div>
        {/* For each details items */}
        {transaction.details.map((detail, index) => (
          <CategoryPicker
            key={index}
            transactionDetail={detail}
            categories={categories}
            onChange={handleCategoryChange}
          ></CategoryPicker>
        ))}
      </div>
    </div>
  );
}
