// import React from 'react'

export default function Header() {
  return (
    <div className="header">
      <img
        style={{ maxHeight: "128px", maxWidth: "128px" }}
        src="/holistic_finance_original_logo.png"
      />
      <p style={{ paddingLeft: "2rem", fontWeight: "500", fontSize: "1.5rem" }}>
        Automated Expenses Tracker
      </p>
    </div>
  );
}
