// import React from "react";
// import { Link } from "react-router-dom";
import "../styles/nav.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="navbar">
        <li>
          <NavLink
          style={{width:'100%', display:'block'}}
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
          style={{width:'100%', display:'block'}}
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
            <NavLink 
          style={{width:'100%', display:'block'}} to="/reports">Reports</NavLink>
          </li>
          <li>
            <NavLink 
          style={{width:'100%', display:'block'}} to="/settings">Settings</NavLink>
          </li>
          {/* Add more links for other routes */}
        </ul>
      </div>
    </div>
  );
}
