// CustomPopup.tsx
import React, { useEffect } from "react";
import "./CustomPopup.css";

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
    <div className="popup-overlay">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-button"
          onClick={handleClose}
          style={{
            color: "red",
            border: "1px solid white",
            borderRadius: "50%",
            width: "2rem",
            height: "2rem",
            textAlign: "center"
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

export default CustomPopup;
