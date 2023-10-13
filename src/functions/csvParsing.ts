import { getAllTransactions } from "../database/transactions.ts";
import { Transaction, Import } from "../types/transaction.ts";
import { ColumnIndexes } from "../types/csvParsing.ts";
import { parse as csvParse } from "csv-parse/browser/esm";
import { parse as dateParse } from "date-fns";
import sha256 from "crypto-js/sha256";
import { v4 as uuidv4 } from "uuid";

/*
 * This is a list of valid merchant column names from the main five banks:
 *
 * ANZ: Details
 * ASB: Payee
 * BNZ: Payee
 * Kiwibank: OP name
 * Westpac: Other Party
 */
const merchantTitles: string[] = ["Details", "Payee", "OP name", "Other Party"];

/*
 * This is a list of valid date formats from the main five banks:
 *
 * ANZ: dd/MM/yyyy
 * ASB: yyyy/MM/dd
 * BNZ: dd/MM/yyyy
 * Kiwibank: dd-MM-yyyy
 * Westpac: dd/MM/yyyy
 */
const dateFormats: string[] = ["dd/MM/yyyy", "yyyy/MM/dd", "dd-MM-yyyy"];

/**
 * Reads a csv bank statement line by line and generates an import of valid expense transactions, and a list of indexes of transactions duplicated in the database
 *
 * @param {File} csvFile A csv bank statement file loaded in by the user
 * @param {string} account The account to link the import to
 * @returns {Promise<{import: Import; transactions: Transaction[]; dupeIndexes: number[];}>} An import object from the valid expense transactions from the bank statement, and the indexes of any transactions duplicated in the database
 */
export async function generateImportFromFile(
  csvFile: File,
  account: string
): Promise<{
  import: Import;
  transactions: Transaction[];
  dupeIndexes: number[];
}> {
  // Get the raw data from the file in the form of a string
  const rawData: string = await getRawDataFromFile(csvFile);

  // Tokenise the raw data to an array of string arrays
  let csvData: string[][] = await parseStringToCsvData(rawData);

  // Clean the data of invalid rows
  csvData = cleanData(csvData);

  // Get the column indexes (date, merchant, and amount)
  const columnIndexes: ColumnIndexes = getColumnIndexes(csvData);

  // Generate a new import ID
  const importId: string = uuidv4();

  // Create a new import with the list of transactions
  const newImport: Import = {
    id: importId,
    importDate: new Date(),
    account: account
  };

  // Split the data into a list of transactions
  const transactions: Transaction[] = getTransactions(
    csvData,
    columnIndexes,
    account,
    importId
  );

  // Get a list of the indexes of any new transactions that are duplicated in the database
  const dupeIndexes: number[] = await getDupeIndexes(account, transactions);

  // Return the new import and the indexes of the duplicate transactions
  return {
    import: newImport,
    transactions: transactions,
    dupeIndexes: dupeIndexes
  };
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
    csvParse(
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
  // Filter the csv data line by line
  return csvData.filter(
    // Check if the current line has at least three columns and that its elements aren't all empty strings
    (line) => line.length >= 3 && !line.every((str) => str === "")
  );
}

/**
 * Gets the column indexes from raw csv data
 *
 * @param csvData The csv data to get the column indices from
 * @returns The column indices of the csv data
 */
function getColumnIndexes(csvData: string[][]): ColumnIndexes {
  // Get the header of the csv data
  const header: string[] = csvData[0];
  //const header: string[] = csvData[0];

  // Get the column indices from the header
  //const columnIndexes: ColumnIndexes = {
  const columnIndexes: ColumnIndexes = {
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
 * @param account The account that these transactions came from
 * @param importId The ID of the import these transactions belong to
 * @returns A list of new transactions
 */
function getTransactions(
  csvData: string[][],
  columnIndexes: ColumnIndexes,
  account: string,
  importId: string
): Transaction[] {
  // Create a new list of transactions populate
  //const transactions: Transaction[] = [];
  const transactions: Transaction[] = [];

  // For each line after the header in csvData
  for (let i: number = 1; i < csvData.length; i++) {
    // Get the current line of data
    //const line: string[] = csvData[i];
    const line: string[] = csvData[i];

    // Try to create a new transaction from the current line and push it to the list of transactions
    try {
      transactions.push(
        getTransactionFromLine(line, columnIndexes, account, importId)
      );
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
 * Splits a line from csv data into a single transaction.
 *
 * @param line A line from the csv data to be parsed to a transaction
 * @param columnIndexes The column indices of the csv data
 * @param account The account connected to the current transaction
 * @param importId The ID of the import this transaction belongs to
 *
 * @returns A new transaction
 */
function getTransactionFromLine(
  line: string[],
  columnIndexes: ColumnIndexes,
  account: string,
  importId: string
): Transaction {
  // Get the date, merchant, and amount from the line
  const date: Date = parseDate(line[columnIndexes.dateIndex]);
  const merchant: string = line[columnIndexes.merchantIndex];
  let amount: number = parseFloat(line[columnIndexes.amountIndex]);

  // If the amount is positive or $0, throw an error
  if (amount >= 0) throw new Error("Amount was positive; Not a valid expense.");

  // Make the amount positive, and convert from dollars to cents
  amount = Math.round(Math.abs(amount) * 100);

  // Create a hash from the amount, date, and merchant
  const hash: string = sha256(
    `${date.toString()}${merchant}${amount}`
  ).toString();

  // Create and return a new transaction from the retrieved data
  return {
    id: uuidv4(),
    import: importId,
    account: account,
    hash: hash,
    date: date,
    merchant: merchant,
    totalAmount: amount,
    details: [{ amount: amount, category: "Default" }]
  } as Transaction;
}

/**
 * Attempts to parse a date string into a date object using the list of available date formats
 *
 * @param dateString The string to be parsed into a date object
 * @returns A parsed date object
 */
function parseDate(dateString: string): Date {
  // Try to parse the date using one of the available formats
  //const date: Date | undefined = dateFormats
  const date: Date | undefined = dateFormats
    .map((format) => dateParse(dateString, format, new Date()))
    .find((parsedDate) => !isNaN(parsedDate.getTime()));

  // If the parse worked, return the parsed date
  if (date) {
    return date;
  }

  // Otherwise, throw an error
  throw new Error("Date format not recognised.");
}

/**
 * Gets a list of indexes of transactions that are potentially duplicating the database
 *
 * @param account
 * @param transactions
 * @returns An array of indexes of the offending transactions
 */
async function getDupeIndexes(
  account: string,
  transactions: Transaction[]
): Promise<number[]> {
  // Get a list of saved transactions from IndexedDB
  const savedTransactions: Transaction[] = await getAllTransactions(account);

  // For each transaction, store a boolean for if it matches a transaction in the database or not
  const isDupes: boolean[] = transactions.map((transaction) =>
    savedTransactions.some(
      (savedTransaction) => transaction.hash === savedTransaction.hash
    )
  );

  // Convert the list of booleans to a list of indexes of each time a boolean is true
  return isDupes
    .map((value, index) => (value ? index : -1))
    .filter((index) => index !== -1);
}
