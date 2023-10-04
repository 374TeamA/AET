import React, { useEffect } from "react";
import CSVUploader from "../../components/CSVUploader";
import { generateImportFromFile } from "../../functions/csvParsing";
import Table from "../../components/Transaction/Table";
export default function Import() {
  const [file, setFile] = React.useState<File>();

  useEffect(() => {
    const processCSV = async () => {
      if (file) {
        //TODO: properly format the csv parser and its returns
        //TODO: Link importing to an account
        const importWithDupeIndexes = await generateImportFromFile(file, "");

        console.log(importWithDupeIndexes.import);
        console.log(importWithDupeIndexes.dupeIndexes);
      }
    };
    processCSV();
  }, [file]);

  return (
    <div>
      <CSVUploader setFile={setFile} />
      <Table />
    </div>
  );
}
