import { useTitle } from "../hooks/UseTitle";
import CustomPopup from "../components/Popup";
import { useState, useContext, useEffect } from "react";
import { AccountContext } from "../context/AccountsContext";
import "../styles/dashboard.css";
import HelpDialog from "../components/HelpDialog";
import { Account } from "../types/account";
import EditAccounts from "./Settings/EditAccounts";
import EditCategories from "./Settings/EditCategories";
//TODO: Set it up so if there is no accounts the dashboard prompts to create a new account
export default function Dashboard() {
  const accounts = useContext(AccountContext);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(
    accounts == null ? false : accounts.length > 0 ? false : true
  );

  useEffect(() => {
    if (accounts != null && accounts.length == 0) {
      setPopupOpen(true);
    }
  }, [accounts]);
  const handleOpenPopup = () => {
    setPopupOpen(true);
  };
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
                  style={{
                    width: "45%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      display: "block",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      opacity: "0.1"
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
        <button onClick={handleOpenPopup}>Open Popup</button>
        <CustomPopup isOpen={isPopupOpen} onClose={handleClosePopup}>
          <div
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
          >
            <div
              style={{
                margin: "0.5rem",
                width: `${isMobile ? "100%" : "50%"}`
              }}
            >
              <EditAccounts />
            </div>
            <div
              style={{
                margin: "0.5rem",
                width: `${isMobile ? "100%" : "50%"}`
              }}
            >
              <EditCategories />
            </div>
          </div>
        </CustomPopup>
        <HelpDialog title="This is a help option">
          <p>
            Help text goes here. You can add as much or as little as you like,
            or even add more react components inside if you really like. Great
            fun.<br></br> Might be a good idea to make a similar sort of popup
            component for other parts of the app?
          </p>
        </HelpDialog>
      </div>
    </div>
  );
}
