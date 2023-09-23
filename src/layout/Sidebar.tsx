import React from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";
export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="navbar">
        <li>
          <a href="/">Dashboard</a>
        </li>
        <li>
          <a href="/accounts">Accounts</a>
        </li>
      </ul>
      <div className="bottom-links">
        <ul>
          <li>
            <a href="/reports">Reports</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
          {/* Add more links for other routes */}
        </ul>
      </div>
    </div>
  );
}
