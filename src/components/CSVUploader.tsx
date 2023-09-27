import React from "react";

export default function CSVUploader() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file:File | undefined = event.target.files?.[0];
    if (file) {
      // do something with the file
    }
  };


  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}
