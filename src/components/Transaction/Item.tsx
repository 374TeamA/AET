import { Button, Select, MenuItem } from "@mui/material";
import { Transaction } from "../../types/transaction";
import React, { useEffect } from "react";
interface ItemProps {
  transaction: Transaction;
  categories: {
    [key: string]: string;
  };
  updateTransactions: (transaction: Transaction) => void;
}

export default function Item({
  transaction,
  categories,
  updateTransactions
}: ItemProps) {
  //const categories = React.useContext(CategoryContext);
  const [color, setColor] = React.useState<string>(
    categories[transaction.details[0].category]
  );
  const [option, setOption] = React.useState<string>("");

  useEffect(() => {
    //setColor(categories[transaction.details[0].category] || "#000");
  }, [categories]);

  useEffect(() => {
    if (option === "Default" || option == "") {
      //console.log(categories[option]);
      setColor(categories[option] || "#000");
    } else {
      transaction.details[0].category = option;
      updateTransactions(transaction);
      //console.log(categories[option]);
      setColor(categories[option] || "#000");
    }
  }, [option,categories,transaction,updateTransactions]); // TODO: validate that this doesn't break with the extra dependencies.

  useEffect(() => {
    //console.log(
    //   color,
    //   categories[option],
    //   categories[transaction.details[0].category]
    // );
  }, [color]);

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
        {transaction.details.map((detail) => (
          <div
            style={{
              display: "flex",
              width: "50%",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ width: "15%" }}>
              <p>${detail.amount}</p>
            </div>
            <div>
              <Select
                // variant="contained"
                style={{
                  width: "10rem",
                  fontSize: "0.9rem",
                  margin: "2px",
                  //make the background colour the selected item's colour

                  backgroundColor: `${
                    categories[transaction.details[0].category]
                  }`,
                  color: "white"
                }}
                onChange={(e) => {
                  setOption(e.target.value as string);
                }}
                size="small"
                defaultValue={detail.category}
              >
                <MenuItem
                  style={{
                    backgroundColor: `${
                      categories[detail.category] || "black"
                    }`,
                    color: "white"
                  }}
                  value={detail.category}
                >
                  {detail.category}
                </MenuItem>
                {Object.keys(categories).map((category) => {
                  if (category !== detail.category) {
                    return (
                      <MenuItem
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
                style={{ width: "5rem", fontSize: "0.9rem" }}
              >
                Split
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
