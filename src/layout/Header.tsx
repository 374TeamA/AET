// import React from 'react'

export default function Header() {
  return (
    <div className="header">
      <img
        alt="logo"
        className="logo"
        src="./holistic_finance_original_logo.png"
      />
      <p
        className="title"
        style={{ paddingLeft: "2rem", fontWeight: "500", fontSize: "1.5rem" }}
      >
        Automated Expenses Tracker
      </p>
    </div>
  );
}
