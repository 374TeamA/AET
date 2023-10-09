import React, { useEffect } from "react";
import CSVUploader from "../../components/CSVUploader";
import { generateImportFromFile } from "../../functions/csvParsing";
import Table from "../../components/Transaction/Table";
import { Import } from "../../types/transaction";
export default function ImportTransaction() {
  const [file, setFile] = React.useState<File>();
  const [importData /*, setImportData*/] = React.useState<Import | undefined>(
    undefined
  );
  useEffect(() => {
    const processCSV = async () => {
      if (file) {
        // TODO: properly format the csv parser and its returns
        // TODO: Link importing to an account
        const importWithDupeIndexes = await generateImportFromFile(
          file,
          "test"
        );
        console.log(importWithDupeIndexes);

        // TODO: Does not work with new import type
        // console.log(importWithDupeIndexes.import);
        // setImportData(importWithDupeIndexes.import);
        // console.log(importWithDupeIndexes.dupeIndexes);
      }
    };
    processCSV();
  }, [file]);

  return (
    <div>
      <CSVUploader setFile={setFile} />
      {importData && <Table importData={importData} />}
    </div>
  );
}
