import React, { useEffect } from "react";
import CSVUploader from "../../components/CSVUploader";
import { parseCSV } from "../../functions/parseCSV";
export default function Import() {
  const [file, setFile] = React.useState<File | undefined>(undefined);

  useEffect(() => {
    if (file) {
      parseCSV(file);
    }
  }, [file]);
  return (
    <div>
      <CSVUploader fileReturn={setFile} />
    </div>
  );
}
