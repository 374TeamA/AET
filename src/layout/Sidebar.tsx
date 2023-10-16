// import React from "react";
// import { Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import "../styles/nav.css";
import { NavLink, useLocation } from "react-router-dom";
import { AccountContext } from "../context/AccountsContext";
import { Divider, Typography } from "@mui/material";

export default function Sidebar() {
  const location = useLocation();
  const accounts = useContext(AccountContext);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initialize isMobile on component mount
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    console.log("sidebar " + location.pathname);
  }, [location]);

  const toggleIfMobile = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

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
          <NavLink
            onClick={toggleIfMobile}
            style={{ width: "100%", display: "block" }}
            to="/"
          >
            Dashboard
          </NavLink>
        </li>
        <Divider />
        <div>
          <Typography variant="overline" sx={{ p: 2 ,mt:4}}>
            Bank Accounts
          </Typography>
        </div>
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
                  to={`/accounts/${account.id}`}>
                    {account.name}
                </NavLink>
            </li>
          );
        })}
        <div>
          <Typography variant="overline" sx={{ p: 2 ,mt:2}}>
            Other Expenses
          </Typography>
        </div>
        <li
              className={
                location.pathname.includes("CASH") ? "selected" : ""
              }
            >
              <NavLink
                style={{ width: "100%", display: "block" }}
                to={`/accounts/CASH`}
              >
                Manual Entry
              </NavLink>
            </li>
      </ul>
      <div className="bottom-links">
        <ul>
          <li
            className={location.pathname.includes("reports") ? "selected" : ""}
          >
            <NavLink
              onClick={toggleIfMobile}
              style={{ width: "100%", display: "block" }}
              to="/reports"
            >
              Reports
            </NavLink>
          </li>
          <li
            className={location.pathname.includes("settings") ? "selected" : ""}
          >
            <NavLink
              onClick={toggleIfMobile}
              style={{ width: "100%", display: "block" }}
              to="/settings"
            >
              Settings
            </NavLink>
          </li>
          {/* Add more links for other routes */}
        </ul>
      </div>
    </div>
  );
}
