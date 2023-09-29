import React from "react";

interface Props {
  fileReturn: (file: File) => void;
}

export default function CSVUploader({ fileReturn }: Props) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      // do something with the file
      fileReturn(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}
