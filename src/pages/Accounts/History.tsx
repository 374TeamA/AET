// import React from "react";

import { useEffect, useState } from "react";
import { deleteImport, getImports } from "../../database/imports";
import { Import } from "../../types/transaction";
import { getAllTransactions } from "../../database/transactions";
import { useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import CustomPopup from "../../components/Popup";
import CustomButton from "../../components/CustomButton";
interface ImportTotals {
  id: string;
  earliestTransaction: Date;
  latestTransaction: Date;
  importDate: Date;
  transactions: number;
  amount: number;
}
export default function History() {
  const params = useParams();
  const accountId: string | undefined = params.id;
  const [imports, setImports] = useState<Import[]>([]);
  const [importTotals, setImportTotals] = useState<ImportTotals[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [importID, setImportID] = useState<string>("");
  const deleteDBImport = (importId: string) => {
    deleteImport(importId).then(() => {
      const importTotalsCopy = [...importTotals];
      const index = importTotalsCopy.findIndex(
        (importItem) => importItem.id === importId
      );
      if (index > -1) {
        importTotalsCopy.splice(index, 1);
        //setImportTotals(importTotalsCopy);
      }
    });
  };
  useEffect(() => {
    const importTotals: { [key: string]: ImportTotals } = {};
    getImports().then((res) => {
      setImports(res);
    });

    accountId &&
      getAllTransactions(accountId).then((res) => {
        for (let i = 0; i < res.length; i++) {
          const amount = res[i].details.reduce(
            (accumulator: number, detail) => accumulator + detail.amount,
            0
          );
          if (importTotals[res[i].import] == undefined) {
            importTotals[res[i].import] = {
              id: res[i].import,
              earliestTransaction: res[i].date,
              latestTransaction: res[i].date,
              importDate:
                imports.find((importItem) => importItem.id === res[i].import)
                  ?.importDate || new Date(),
              transactions: 1,
              amount: amount
            };
          } else {
            importTotals[res[i].import].transactions += 1;
            importTotals[res[i].import].amount += amount;
            if (res[i].date < importTotals[res[i].import].earliestTransaction) {
              importTotals[res[i].import].earliestTransaction = res[i].date;
            }
            if (res[i].date > importTotals[res[i].import].latestTransaction) {
              importTotals[res[i].import].latestTransaction = res[i].date;
            }
          }
        }
        const newImpTotals: ImportTotals[] = [];
        Object.keys(importTotals).forEach((importItem) => {
          newImpTotals.push(importTotals[importItem]);
        });
        setImportTotals(newImpTotals);
      });
  }, [accountId, imports]);

  const columns: GridColDef[] = [
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (params: GridCellParams) => (
        <Button
          onClick={() => {
            setImportID(params.row.id as string);
            setPopupOpen(true);
            // console.log(params.row.id);
            // deleteDBImport(params.row.id as string);
          }}
        >
          X
        </Button>
      )
    },
    {
      field: "importDate",
      headerName: "Import Date",
      flex: 1,
      valueFormatter: ({ value }) => (value as Date).toLocaleDateString()
    },
    {
      field: "earliestTransaction",
      headerName: "Earliest Transaction",
      flex: 1,
      valueFormatter: ({ value }) => (value as Date).toLocaleDateString()
    },
    {
      field: "latestTransaction",
      headerName: "Latest Transaction",
      flex: 1,
      valueFormatter: ({ value }) => (value as Date).toLocaleDateString()
    },
    { field: "transactions", headerName: "Transactions", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      valueFormatter: ({ value }) => `$${((value as number) / 100).toFixed(2)}`
    }
  ];
  return (
    <Box style={{ height: "100%", width: "86dvw" }}>
      <CustomPopup
        isOpen={popupOpen}
        onClose={() => {
          setPopupOpen(false);
        }}
      >
        <h1 style={{ borderBottom: "1px solid lightgrey" }}>Confirmation</h1>
        <div style={{ padding: "1rem" }}>
          <p>Are you sure you want to remove this import? </p>
          <p>All transactions from it will also be removed</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <CustomButton
            onClick={() => {
              deleteDBImport(importID);
              setPopupOpen(false);
              setImportID("");
              // console.log("clicked");
            }}
          >
            Confirm
          </CustomButton>
          <CustomButton
            onClick={() => {
              setPopupOpen(false);
              setImportID("");
            }}
          >
            Cancel
          </CustomButton>
        </div>
      </CustomPopup>
      <DataGrid columns={columns} rows={importTotals} />
    </Box>
  );
}
