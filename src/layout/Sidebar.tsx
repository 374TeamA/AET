import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="/">Dashboard</a>
        </li>
        <li>
          <a href="/accounts">Accounts</a>
        </li>
        <li>
          <a href="/settings">Settings</a>
        </li>
        {/* Add more links for other routes */}
      </ul>
    </div>
  );
}
