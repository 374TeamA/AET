import React from "react";

export default function History() {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          height: "3rem",
          width: "100%",
          border: "1px solid lightgrey",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <div
          style={{
            flexGrow: "0.2"
          }}
        >
          <p>Delete</p>
        </div>
        <p>|</p>
        <div
          style={{
            flexGrow: "1"
          }}
        >
          Date
        </div>
        <p>|</p>
        <div
          style={{
            flexGrow: "1"
          }}
        >
          Transactions
        </div>
        <p>|</p>
        <div
          style={{
            flexGrow: "1"
          }}
        >
          Amount
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: "3rem",
          width: "100%",
          border: "1px solid lightgrey",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <div
          style={{
            flexGrow: "0.2"
          }}
        >
          <p>X</p>
        </div>
        <div
          style={{
            flexGrow: "1"
          }}
        >
          01/01/2023
        </div>
        <div
          style={{
            flexGrow: "1"
          }}
        >
          14
        </div>
        <div
          style={{
            flexGrow: "1"
          }}
        >
          $150
        </div>
      </div>
    </div>
  );
}
