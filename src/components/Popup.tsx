// CustomPopup.tsx
import React, { useEffect } from "react";
import "./CustomPopup.css";
import { Paper } from "@mui/material";

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  isOpen,
  onClose,
  children
}) => {
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    });
  }, []);
  return isOpen ? (
    <div className="popup-overlay" onClick={handleClose}>
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "100vh", overflow: "scroll" }}
      >
        <Paper elevation={0} sx={{ padding: 2 }}>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
          {children}
        </Paper>
      </div>
    </div>
  ) : null;
};

export default CustomPopup;
