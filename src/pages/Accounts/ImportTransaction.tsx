import React from "react";
import CSVUploader from "../../components/CSVUploader";
import { generateImportFromFile } from "../../functions/csvParsing";
import Table from "../../components/Transaction/Table";
import { Transaction } from "../../types/transaction";
import { saveImport } from "../../database/imports";
import { useParams } from "react-router-dom";
export default function ImportTransaction() {
  const [transactions , setTransactions] = React.useState<Transaction[] | undefined>(
    undefined
  );
  const params = useParams();
  const accountId = params.id;
  
  const processCSV = async (file:File) => {
    if (file) {
      // TODO: properly format the csv parser and its returns
      // TODO: Link importing to an account
      const importWithDupeIndexes = await generateImportFromFile(
        file,
        "test"
      );
      console.log(importWithDupeIndexes);
      
      // give each transaction an account ID
      importWithDupeIndexes.transactions.forEach((transaction) => {
        transaction.account = accountId as string;
      });

      //console.log(importWithDupeIndexes.import);
      setTransactions(importWithDupeIndexes.transactions);
      // console.log(importWithDupeIndexes.dupeIndexes);
      // Save import object to database
      saveImport(importWithDupeIndexes.import);
      // transactions get saved in Table.tsx
    }
  };

  return (
    <div>
      <CSVUploader onUpload={processCSV} />
      {transactions && <Table transactions={transactions} />}
    </div>
  );
}
