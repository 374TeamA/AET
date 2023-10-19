import React, { useRef } from "react";
import "./csvuploader.css";
import HelpDialog from "./HelpDialog";
interface Props {
  onUpload: (file: File) => void;
}

export default function CSVUploader({ onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    //console.log("Popup!");
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex" }}>
        <HelpDialog title="Help">
          <p>
            Click on the "Drag file here" box to select a file from your
            computer
          </p>
        </HelpDialog>
        <div
          className="file-upload-button"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <span className="upload-input">
            Drag file here, Or Click to Upload
          </span>
        </div>
      </div>
    </>
  );
}
