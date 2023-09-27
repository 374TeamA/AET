// import React from "react";
// import { Link } from "react-router-dom";
import "../styles/nav.css";
import { NavLink } from "react-router-dom";
import "../styles/nav.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="navbar">
        <li>
          <NavLink
            to="/"
            className={
              window.location.href.includes("Dashboard") ? "active" : ""
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="accounts"
            className={
              window.location.href.includes("Accounts") ? "active" : ""
            }
          >
            Accounts
          </NavLink>
        </li>
      </ul>
      <div className="bottom-links">
        <ul>
          <li>
            <NavLink to="/reports">Reports</NavLink>
          </li>
          <li>
            <NavLink to="/settings">Settings</NavLink>
          </li>
          {/* Add more links for other routes */}
        </ul>
      </div>
    </div>
  );
}
