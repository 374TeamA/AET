import { Button } from "@mui/material";
import { Transaction } from "../../types/transaction";
interface ItemProps {
  transaction: Transaction;
}

export default function Item({ transaction }: ItemProps) {
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
              <Button
                variant="contained"
                style={{
                  width: "10rem",
                  fontSize: "0.9rem",
                  margin: "2px",
                  backgroundColor: "#3f51b5",
                  color: "white"
                }}
              >
                {detail.category}
              </Button>
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
