import { Button } from "@mui/material";

export default function Item() {
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
        <p>01/01/2023</p>
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
          <p>The Warehouse NZ</p>
        </div>
        <div style={{ width: "15%" }}>
          <p>$100.00</p>
        </div>
        <div>
          <Button
            variant="contained"
            style={{ width: "10rem", fontSize: "0.9rem", margin: "2px" }}
          >
            Category
          </Button>
          <Button
            variant="contained"
            style={{ width: "5rem", fontSize: "0.9rem" }}
          >
            Split
          </Button>
        </div>
      </div>
    </div>
  );
}
