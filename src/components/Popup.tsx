// CustomPopup.tsx
import React from 'react';
import './CustomPopup.css';

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ isOpen, onClose, children }) => {
  const handleClose = () => {
    onClose();
  };
  return isOpen ? (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

export default CustomPopup;