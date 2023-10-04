import React, { useEffect } from "react";
import CSVUploader from "../../components/CSVUploader";
import { generateImportFromFile } from "../../functions/csvParsing";
import Table from "../../components/Transaction/Table";
import { Import } from "../../types/transaction";
export default function ImportTransaction() {
  const [file, setFile] = React.useState<File>();
  const [importData, setImportData] = React.useState<Import | undefined>(
    undefined
  );
  useEffect(() => {
    const processCSV = async () => {
      if (file) {
        //TODO: properly format the csv parser and its returns
        //TODO: Link importing to an account
        const transactions = await generateImportFromFile(file, "");
        console.log(transactions);
        setImportData(transactions);
      }
    };
    processCSV();
  }, [file]);

  return (
    <div>
      <CSVUploader setFile={setFile} />
      <Table importData={importData} />
    </div>
  );
}
