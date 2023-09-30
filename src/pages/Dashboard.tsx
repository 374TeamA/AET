import { useTitle } from "../hooks/UseTitle";
import CustomPopup from "../components/Popup";
import {useState} from 'react';

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


  return (<div>
    <div>
    <button onClick={handleOpenPopup}>Open Popup</button>
      <CustomPopup isOpen={isPopupOpen} onClose={handleClosePopup}>
        <h2>This is a custom popup!</h2>
        <p>Popup content goes here.</p>
      </CustomPopup>
    </div>
    </div>);
}
