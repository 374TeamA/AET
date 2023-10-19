import { useTitle } from "../hooks/UseTitle";
import CustomPopup from "../components/Popup";
import { useState, useContext, useEffect } from "react";
import { AccountContext } from "../context/AccountsContext";
import "../styles/dashboard.css";
// import HelpDialog from "../components/HelpDialog";
import { Account } from "../types/account";
import EditAccounts from "./Settings/EditAccounts";
import EditCategories from "./Settings/EditCategories";
import { Button, Grid, Typography } from "@mui/material";
import { GraphConfig } from "../types/graph";
import { getFavouriteGraphs } from "../database/graphs";
import FavouriteGraph from "../components/FavouriteGraph";
import {
  SnackbarContextValue,
  SnackbarContext
} from "../context/SnackbarContext";
//TODO: Set it up so if there is no accounts the dashboard prompts to create a new account

export default function Dashboard() {
  const { showSnackbar } = useContext<SnackbarContextValue>(SnackbarContext);
  const accounts = useContext(AccountContext);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(
    accounts == null ? false : accounts.length > 0 ? false : true
  );
  const [favouriteGraphs, setFavouriteGraphs] = useState<GraphConfig[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  isMobile; // literally this is here to stop linting. TODO: remove this

  // Check if there are no accounts and open the popup if there are none
  useEffect(() => {
    if (accounts != null && accounts.length == 0) {
      setPopupOpen(true);
    }
  }, [accounts]);

  // Handle resizing the window
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
    getFavouriteGraphs().then((graphs) => {
      setFavouriteGraphs(graphs);
    });
  }, []);

  /**
   * Handles opening the popup
   */
  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  /**
   * Handles closing the popup
   */
  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  useTitle("Dashboard");
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: `${accounts == null ? "" : accounts.length > 0 ? "9dvh" : ""}`
        }}
      >
        {accounts &&
          accounts.map((account: Account) => {
            return (
              <div className="dashboard-account" key={account.id}>
                <div
                  style={{
                    width: "55%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <p>{account.name}</p>
                </div>
                <div
                  className="image-container"
                  style={{
                    width: "45%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    display: "inline-block"
                  }}
                >
                  <img
                    className="dashboard-image"
                    style={{
                      width: "20dvw",
                      display: "block",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      opacity: "0.5"
                    }}
                    src="https://uxwing.com/wp-content/themes/uxwing/download/business-professional-services/credit-card-swipe-icon.png"
                  ></img>
                </div>
              </div>
            );
          })}
      </div>
      <div
        className="content"
        style={{
          height: `${
            accounts == null ? "88dvh" : accounts.length > 0 ? "79dvh" : "88dvh"
          }`
        }}
      >
        {accounts != null && accounts.length == 0 && (
          <button onClick={handleOpenPopup}>Open Popup</button>
        )}
        <CustomPopup isOpen={isPopupOpen} onClose={handleClosePopup}>
          <Typography variant="h5"> Welcome to AET!</Typography>
          <Typography sx={{ p: 2 }}>
            Let's get started - add a bank account and choose how you want to
            categorise your expenses.
          </Typography>
          <Grid container spacing={2}>
            <Grid md={6} sm={11} item>
              <EditAccounts />
            </Grid>
            <Grid item md={6} sm={11}>
              <EditCategories />
            </Grid>
          </Grid>
        </CustomPopup>
        {/* <HelpDialog title="This is a help option">
          <p>
            Help text goes here. You can add as much or as little as you like,
            or even add more react components inside if you really like. Great
            fun.<br></br> Might be a good idea to make a similar sort of popup
            component for other parts of the app?
          </p>
        </HelpDialog> */}
        {/* Display favourite graphs */}
        <div id="favouriteGraphs" style={{ display: "flex", flexWrap: "wrap" }}>
          {favouriteGraphs.map((graph, index) => (
            <div style={{ minHeight: "33dvh" }}>
              <FavouriteGraph graphConfig={graph} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
