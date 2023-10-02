import { parse } from "csv-parse/browser/esm";
import { Readable } from "stream";

import { v4 as uuidv4 } from "uuid";
import { Transaction, Import, ColumnInfo } from "../types/transaction";

/*eslint-disable*/

/**
 * Function to read a text file line by line and return lines as an array
 *
 * @export
 * @param {File} csvFile
 * @return {*}  {Transaction[]}
 */
export function loadImportFromFile(csvFile: File): Promise<Import> {
  // Create and return a new promise of a transaction import
  return new Promise<Import>((resolve, reject) => {
    // Create a new file reader to read the file
    const reader = new FileReader();

    // Upon load of the file
    reader.onload = async (e) => {
      // Get the contents of the file
      const fileContents: string | ArrayBuffer | null | undefined =
        e.target?.result;

      // If the contents is a string
      if (fileContents && typeof fileContents === "string") {
        // Parse the file contents to an array of string arrays
        let csvData: string[][] = await parseStringToCsvData(fileContents);

        // Parse to an import
        let newImport: Import = createImportFromCsvData(csvData);

        // Resolve to the newly created import
        resolve(newImport);
      }

      // Otherwise, reject with a new error
      else {
        reject(new Error("Invalid CSV data."));
      }
    };

    // Upon error of the reader, reject with the error
    reader.onerror = (err) => {
      reject(err);
    };

    // Attempt to read the CSV file, as text
    reader.readAsText(csvFile);
  });
}

async function parseStringToCsvData(rawData: string): Promise<string[][]> {
  return new Promise<string[][]>((resolve, reject) => {
    parse(csvString, { delimiter: "," }, (err, records: string[][]) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(records);
      }
    });
  });
}

// This is a list of valid merchant headers from the main banks.
// ANZ: Details
// ASB: Payee
// BNZ: Payee
// Kiwibank: OP name
// Westpac: Other Party
const merchantTitles: string[] = ["Details", "Payee", "OP name", "Other Party"];

/**
 *  Parses a csv split into an array of string arrays to a transaction import object
 *
 * @param csvData A csv split into an array of string arrays
 * @returns A populated transaction import
 */
function createImportFromCsvData(csvData: string[][]): Import {
  // Clean the data
  csvData = cleanData(csvData);

  // Get the column info
  let columnInfo: ColumnInfo = getColumnInfo(csvData);

  // Split the data into a list of transactions
  let transactions: Transaction[] = getTransactions(csvData, columnInfo);

  // Return a new import object with the list of transactions
  return {
    id: uuidv4(),
    importDate: new Date(),
    transactions: transactions
  };
}

/**
 * Removes invalid lines from csv data
 *
 * @param csvData The csv data to be cleaned
 * @returns The cleaned csv data
 */
function cleanData(csvData: string[][]): string[][] {
  // Starting at the first line in the data
  let i: number = 0;

  // For each line in the CSV
  while (i < csvData.length) {
    // If the current line has no usefule information in it, remove it from the data
    if (csvData[i].length < 3 || csvData[i].every((str) => str === "")) {
      csvData.splice(i, 1);
    }
    // Otherwise, go to the next line
    else {
      i++;
    }
  }

  // Return the cleaned data
  return csvData;
}

/**
 * Gets column indices from raw csv data
 *
 * @param csvData The csv data to get the column indices from
 * @returns The column indices of the csv data
 */
function getColumnInfo(csvData: string[][]): ColumnInfo {
  // Get the header of the csv data
  let header: string[] = csvData[0];

  // Get the column indices from the header
  let columnInfo: ColumnInfo = {
    amountIndex: header.indexOf("Amount"),
    dateIndex: header.indexOf("Date"),
    merchantIndex: header.findIndex((item) => merchantTitles.includes(item))
  };

  // If any index is -1, throw an error
  if (
    columnInfo.amountIndex === -1 ||
    columnInfo.dateIndex === -1 ||
    columnInfo.merchantIndex === -1
  ) {
    throw new Error("Header information either not found or misformatted"); //TODO: Make a better error name
  }

  // Return the column indices
  return columnInfo;
}

/**
 * Splits csv data into a list of transactions
 *
 * @param csvData The csv data to split into transactions
 * @param columnInfo The column indices of the csv data
 * @returns
 */
function getTransactions(
  csvData: string[][],
  columnInfo: ColumnInfo
): Transaction[] {
  // Create a new list of transactions populate
  let transactions: Transaction[] = [];

  // For each line after the header in csvData
  for (let i: number = 1; i < csvData.length; i++) {
    // Get the current line of data
    let line: string[] = csvData[i];

    // If the amount is positive, skip this transaction
    if (parseFloat(line[columnInfo.amountIndex]) > 0) {
      continue;
    }

    // Create a new transaction from the current line, and push it to the list of transactions
    transactions.push(getTransactionFromLine(line, columnInfo));
  }

  // Return the list of transactions
  return transactions;
}

/**
 * Splits a line from csv data into a single transaction
 *
 * @param line A line from the csv data to be parsed to a transaction
 * @param columnInfo The column indices of the csv data
 * @returns
 */
function getTransactionFromLine(
  line: string[],
  columnInfo: ColumnInfo
): Transaction {
  // Get the amount
  let amount: number = parseFloat(line[columnInfo.amountIndex]);

  // Make the amount positive
  amount = Math.abs(amount);

  // Get the date
  let date: Date = new Date(line[columnInfo.dateIndex]);

  let merchant: string = line[columnInfo.merchantIndex];

  // Populate and return
  return {
    id: uuidv4(),
    date: date,
    merchant: merchant,
    details: [{ amount: amount, category: "Default" }]
  };
}
