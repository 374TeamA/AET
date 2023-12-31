import React, { useContext } from "react";
import CSVUploader from "../../components/CSVUploader";
import { generateImportFromFile } from "../../functions/csvParsing";
import Table from "../../components/Transaction/Table";
import { Transaction } from "../../types/transaction";
import { saveImport } from "../../database/imports";
import { useParams } from "react-router-dom";
import {
  SnackbarContext,
  SnackbarContextValue
} from "../../context/SnackbarContext";

export default function ImportTransaction() {
  const [transactions, setTransactions] = React.useState<
    Transaction[] | undefined
  >(undefined);
  const { showSnackbar } = useContext<SnackbarContextValue>(SnackbarContext);
  const params = useParams();
  const accountId = params.id;

  const processCSV = async (file: File) => {
    if (file) {
      try {
        // Generate a list of transactions linked to an account, along with import data and dupe indexes
        if (!accountId) return;
        const importWithDupeIndexes = await generateImportFromFile(
          file,
          accountId,
          false
        );
        //console.log(importWithDupeIndexes);

        ////console.log(importWithDupeIndexes.import);
        setTransactions(importWithDupeIndexes.transactions);
        // //console.log(importWithDupeIndexes.dupeIndexes);
        // Save import object to database
        saveImport(importWithDupeIndexes.import);
        // transactions get saved in Table.tsx
        showSnackbar("success", "CSV Uploaded");
      } catch (ex) {
        showSnackbar("error", "CSV Failed to upload");
      }
    }
  };
  return (
    <div>
      <CSVUploader onUpload={processCSV} />
      {transactions && <Table transactions={transactions} />}
    </div>
  );
}
