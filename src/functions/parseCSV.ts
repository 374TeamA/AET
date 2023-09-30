import { Transaction } from "../types/transaction";
import { parse } from "csv-parse/browser/esm";

// const fs = require("fs");
// Notes to consider:
// What about when the user specifies colums?
// Make a new function that handles that case?

/*eslint-disable*/

// https://stackoverflow.com/questions/4950567/reading-client-side-text-file-using-javascript
// https://www.npmjs.com/package/csv-parse

/**
 * Function to read a text file line by line and return lines as an array
 *
 * @export
 * @param {File} csv
 * @return {*}  {Transaction[]}
 */
export function parseCSV(csv: File): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const csvString: string | ArrayBuffer | null | undefined =
        e.target?.result;
      if (csvString && typeof csvString === "string") {
        const lines = parseCSVString(csvString);
        resolve(lines);
      } else {
        reject(new Error("Invalid CSV data."));
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsText(csv);
  });
}

function parseCSVString(csvString: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    parse(csvString, { delimiter: "," }, (err, records) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        // Flatten the array of arrays into a single array of strings
        const lines = records.flat();
        resolve(lines);
      }
    });
  });
}

/**
 *
 *
 * @param {string} line -- may need to change this type
 * @return {*}  {Transaction}
 */
function parseSingleLine(line: string, columns: number[]): Transaction {}
