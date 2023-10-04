import { useTitle } from "../hooks/UseTitle";
import CustomPopup from "../components/Popup";
import { useState } from "react";
import { AccountContext } from "../context/AccountsContext";
import "../styles/dashboard.css";
//TODO: Set it up so if there is no accounts the dashboard prompts to create a new account
export default function Dashboard() {
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };
  useTitle("Dashboard");
  return (
    <div>
      <AccountContext.Consumer>
        {(accounts) => {
          return (
            <>
              {accounts.map((account) => {
                return (
                  <div className="dashboard-account">
                    <div
                      style={{
                        width: "75%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <p>{account.name}</p>
                    </div>
                    <div style={{ width: "25%", height: "100%" }}>
                      <img></img>
                    </div>
                  </div>
                );
              })}
            </>
          );
        }}
      </AccountContext.Consumer>
      <div>
        <button onClick={handleOpenPopup}>Open Popup</button>
        <CustomPopup isOpen={isPopupOpen} onClose={handleClosePopup}>
          <h2>This is a custom popup!</h2>
          <p>Popup content goes here.</p>
        </CustomPopup>
      </div>
    </div>
  );
}
