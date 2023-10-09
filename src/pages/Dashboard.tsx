import { useTitle } from "../hooks/UseTitle";
import CustomPopup from "../components/Popup";
import { useState } from "react";
import { AccountContext } from "../context/AccountsContext";
import "../styles/dashboard.css";
import HelpDialog from "../components/HelpDialog";
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
      <div style={{ display: "flex", height: "9vh" }}>
        <AccountContext.Consumer>
          {(accounts) => {
            return (
              <>
                {accounts.map((account) => {
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
              </>
            );
          }}
        </AccountContext.Consumer>
      </div>
      <div className="content" style={{ height: "79vh" }}>
        <button onClick={handleOpenPopup}>Open Popup</button>
        <CustomPopup isOpen={isPopupOpen} onClose={handleClosePopup}>
          <h2>This is a custom popup!</h2>
          <p>Popup content goes here.</p>
        </CustomPopup>
        <HelpDialog title="This is a help option"><p>Help text goes here. You can add as much or as little as you like, or even add more react components inside if you really like. Great fun.<br></br> Might be a good idea to make a similar sort of popup component for other parts of the app?</p></HelpDialog>
      </div>
    </div>
  );
}
