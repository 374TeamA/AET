import { Transaction, Import } from "../types/transaction.ts";
import { ColumnIndexes } from "../types/csvParsing.ts";
import { parse } from "csv-parse/browser/esm";
import { v4 as uuidv4 } from "uuid";

/*eslint-disable*/

// This is a list of valid merchant column names from the main five banks:
// ANZ: Details
// ASB: Payee
// BNZ: Payee
// Kiwibank: OP name
// Westpac: Other Party
const merchantTitles: string[] = ["Details", "Payee", "OP name", "Other Party"];

/**
 * Reads a csv bank statement line by line and generates an import of valid expense transactions
 *
 * @param csvFile A csv bank statement file loaded in by the user
 * @returns An import object from the valid expense transactions from the bank statement
 */
export async function generateImportFromFile(csvFile: File): Promise<Import> {
  // Get the raw data from the file in the form of a string
  let rawData: string = await getRawDataFromFile(csvFile);

  // Tokenise the raw data to an array of string arrays
  let csvData: string[][] = await parseStringToCsvData(rawData);

  // Clean the data of invalid rows
  csvData = cleanData(csvData);

  // Get the column indexes (date, merchant, and amount)
  let columnIndexes: ColumnIndexes = getColumnIndexes(csvData);

  // Split the data into a list of transactions
  let transactions: Transaction[] = getTransactions(csvData, columnIndexes);

  // Create a new import with the list of transactions, and return it
  return getImportFromTransactions(transactions);
}

/**
 * Gets the raw data from a csv file, loaded by the user
 *
 * @param csvFile The csv file to be parsed
 * @returns The raw csv data in the form of a string
 */
function getRawDataFromFile(csvFile: File): Promise<string> {
  // Create and return a new promise of a transaction import
  return new Promise<string>((resolve, reject) => {
    // Create a new file reader to read the file
    const reader = new FileReader();

    // Upon load of the file
    reader.onload = async (e) => {
      // Get the contents of the file
      const fileContents: string | ArrayBuffer | null | undefined =
        e.target?.result;

      // If the contents is a string
      if (fileContents && typeof fileContents === "string") {
        // Convert the file contents into a transaction import
        resolve(fileContents);
      }

      // Otherwise, reject with a new error
      else {
        reject(new Error("Invalid CSV file."));
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

/**
 * Tokenises a raw csv string into usable csv data
 *
 * @param rawData The raw contents from a csv file
 * @returns The contents converted into a usable array of string arrays
 */
function parseStringToCsvData(rawData: string): Promise<string[][]> {
  // Create a new promise of a string
  return new Promise<string[][]>((resolve, reject) => {
    // Try to parse the raw data, using "," as delimiter, and allow for inconsistent row lengths
    parse(
      rawData,
      { delimiter: ",", relax_column_count: true },
      (err, records: string[][]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(records);
        }
      }
    );
  });
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
    // If the current line has no useful information in it, remove it from the data
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
 * Gets the column indexes from raw csv data
 *
 * @param csvData The csv data to get the column indices from
 * @returns The column indices of the csv data
 */
function getColumnIndexes(csvData: string[][]): ColumnIndexes {
  // Get the header of the csv data
  let header: string[] = csvData[0];

  // Get the column indices from the header
  let columnIndexes: ColumnIndexes = {
    amountIndex: header.indexOf("Amount"),
    dateIndex: header.indexOf("Date"),
    merchantIndex: header.findIndex((item) => merchantTitles.includes(item))
  };

  // If any index is -1, throw an error
  if (
    columnIndexes.amountIndex === -1 ||
    columnIndexes.dateIndex === -1 ||
    columnIndexes.merchantIndex === -1
  ) {
    throw new Error("Column headers not found or incorrectly formatted.");
  }

  // Return the column indices
  return columnIndexes;
}

/**
 * Splits csv data into a list of transactions. (Assumes the csv data has headers.)
 *
 * @param csvData The csv data to split into transactions
 * @param columnIndexes The column indices of the csv data
 * @returns
 */
function getTransactions(
  csvData: string[][],
  columnIndexes: ColumnIndexes
): Transaction[] {
  // Create a new list of transactions populate
  let transactions: Transaction[] = [];

  // For each line after the header in csvData
  for (let i: number = 1; i < csvData.length; i++) {
    // Get the current line of data
    let line: string[] = csvData[i];

    // Try to create a new transaction from the current line and push it to the list of transactions
    try {
      transactions.push(getTransactionFromLine(line, columnIndexes));
    } catch (error) {
      console.error(`Error parsing line ${i}: ${(error as Error).message}`);
    }
  }

  // If no valid "expense" transactions were made, throw an error
  if (transactions.length == 0) {
    throw new Error(
      "No valid expense transactions were found in this bank statement."
    );
  }

  // Return the list of transactions
  return transactions;
}

/**
 * Splits a line from csv data into a single transaction
 *
 * @param line A line from the csv data to be parsed to a transaction
 * @param columnIndexes The column indices of the csv data
 * @returns
 */
function getTransactionFromLine(
  line: string[],
  columnIndexes: ColumnIndexes
): Transaction {
  // Get the amount
  let amount: number = parseFloat(line[columnIndexes.amountIndex]);

  // If the amount is positive, throw an error
  if (amount > 0) throw new Error("Amount was positive; Not a valid expense.");

  // Make the amount positive
  amount = Math.abs(amount);

  // Get the date
  let date: Date = new Date(line[columnIndexes.dateIndex]);

  // Get the merchant
  let merchant: string = line[columnIndexes.merchantIndex];

  // Create and return a new transaction from the retrieved data
  return {
    id: uuidv4(),
    date: date,
    merchant: merchant,
    details: [{ amount: amount, category: "Default" }]
  };
}

/**
 * Converts an array of transactions into an import with a fresh id and timestamp
 *
 * @param transactions An array of transactions to create the import from
 * @returns An import with a unique id and timestamp
 */
function getImportFromTransactions(transactions: Transaction[]): Import {
  return {
    id: uuidv4(),
    importDate: new Date(),
    transactions: transactions
  };
}
