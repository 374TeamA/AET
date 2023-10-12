import React from "react";
import CSVUploader from "../../components/CSVUploader";
import { generateImportFromFile } from "../../functions/csvParsing";
import Table from "../../components/Transaction/Table";
import { Transaction } from "../../types/transaction";
import { saveImport } from "../../database/imports";
import { useParams } from "react-router-dom";
import CustomPopup from "../../components/Popup";
export default function ImportTransaction() {
  const [transactions, setTransactions] = React.useState<
    Transaction[] | undefined
  >(undefined);
  const params = useParams();
  const accountId = params.id;
  const [popup, setPopup] = React.useState(false);
  const processCSV = async (file: File) => {
    setPopup(true);
    if (file) {
      // TODO: properly format the csv parser and its returns
      // TODO: Link importing to an account
      const importWithDupeIndexes = await generateImportFromFile(file, "test");
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
    setPopup(false);
  };
  const handleClose = () => {
    setPopup(false);
  };
  return (
    <div>
      <CustomPopup isOpen={popup} onClose={handleClose}>
        <p>Uploading File....</p>
      </CustomPopup>
      <CSVUploader onUpload={processCSV} />
      {transactions && <Table transactions={transactions} />}
    </div>
  );
}
