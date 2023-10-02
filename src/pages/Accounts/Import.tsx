import React, { useEffect } from "react";
import CSVUploader from "../../components/CSVUploader";
import { loadImportFromFile } from "../../functions/parseCSV";
export default function Import() {
  const [file, setFile] = React.useState<File>();

  useEffect(() => {
    const processCSV = async () => {
      if (file) {
        //TODO: properly format the csv parser and its returns
        const transactions = await loadImportFromFile(file);
        console.log(transactions);
      }
    };
    processCSV();
  }, [file]);

  return (
    <div>
      <CSVUploader setFile={setFile} />
    </div>
  );
}
