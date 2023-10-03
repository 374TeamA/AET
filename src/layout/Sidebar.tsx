// import React from "react";
// import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../styles/nav.css";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  useEffect(() => {
    console.log("sidebar " + window.location.href);
  }, []);
  useEffect(() => {
    console.log("sidebar " + location.pathname);
  }, [location]);

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("open");
    }
  };

  return (
    <div className="sidebar open">
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>
      <ul className="navbar">
        <li className={location.pathname === "/" ? "selected" : ""}>
          <NavLink style={{ width: "100%", display: "block" }} to="/">
            Dashboard
          </NavLink>
        </li>
        <li
          className={location.pathname.includes("accounts") ? "selected" : ""}
        >
          <NavLink style={{ width: "100%", display: "block" }} to="accounts">
            Accounts
          </NavLink>
        </li>
      </ul>
      <div className="bottom-links">
        <ul>
          <li
            className={location.pathname.includes("reports") ? "selected" : ""}
          >
            <NavLink style={{ width: "100%", display: "block" }} to="/reports">
              Reports
            </NavLink>
          </li>
          <li
            className={location.pathname.includes("settings") ? "selected" : ""}
          >
            <NavLink style={{ width: "100%", display: "block" }} to="/settings">
              Settings
            </NavLink>
          </li>
          {/* Add more links for other routes */}
        </ul>
      </div>
    </div>
  );
}
