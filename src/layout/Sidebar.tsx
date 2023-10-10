// import React from "react";
// import { Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import "../styles/nav.css";
import { NavLink, useLocation } from "react-router-dom";
import { AccountContext } from "../context/AccountsContext";
import { Divider, Typography } from "@mui/material";

export default function Sidebar() {
  const location = useLocation();
  const accounts = useContext(AccountContext);
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
    <div className="sidebar">
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>
      <ul className="navbar">
        <li className={location.pathname === "/" ? "selected" : ""}>
          <NavLink style={{ width: "100%", display: "block" }} to="/">
            Dashboard
          </NavLink>
        </li>
        <Divider />
        <Typography variant="h6" sx={{ p: 2 }}>
          Accounts
        </Typography>
        {accounts &&
          accounts.map((account) => {
            return (
              <li
                className={
                  location.pathname.includes(account.id) ? "selected" : ""
                }
                key={account.id}
              >
                <NavLink
                  style={{ width: "100%", display: "block" }}
                  to={`/accounts/${account.id}`}
                >
                  {account.name}
                </NavLink>
              </li>
            );
          })}
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
