import { Button, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Transaction } from "../../types/transaction";
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

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    // Store the update in the database.
    transaction.details[0].category = e.target.value as string;
    updateTransactions(transaction);
    // Note, generally you shouldn't modify props directly, because it doesn't actually change the ui.
    // Props are immutable as far as react is concerned. However, it works for the purposes
    // of creating a updated transaction object to send to the database.
  }

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
        {transaction.details.map((detail,index) => (
          <div
            key={index}
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
                onChange={handleCategoryChange}
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
                {Object.keys(categories).map((category,index) => {
                  if (category !== detail.category) {
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
