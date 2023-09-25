// import React from "react";
// import { Link } from "react-router-dom";
import "../styles/nav.css";
import { Link } from 'react-router-dom';  
export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="navbar">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="accounts">Accounts</Link>
        </li>
      </ul>
      <div className="bottom-links">
        <ul>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          {/* Add more links for other routes */}
        </ul>
      </div>
    </div>
  );
}
