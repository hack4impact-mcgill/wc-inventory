import * as XLSX from "xlsx";
import parseContentTypes from "./parse-content-types";
import type { ContentTypeResponse } from "./parse-content-types";
import type { Location } from "@/types/location";
import parseLocations from "./parse-locations";

export interface Box {
  id: string;
  location: string;
  name: string;
  date: string;
  contents: {
    [contentType: string]: number;
  };
}

export interface InventoryResponse {
  boxes: Box[];
  contentTypes: ContentTypeResponse;
  locations: Set<Location>;
}

export default function readInventory (file: ArrayBuffer): InventoryResponse {

  // array to keep track of boxes
  const boxes: Box[] = [];

  // read from the excel file
  const workbook = XLSX.read(file);

  console.log(workbook);

  // get the box details sheet
  const sheetName = workbook.SheetNames[3];
  console.log(`Reading data from sheet: ${sheetName}`);
  const boxDetails = workbook.Sheets[sheetName];

  // read all the possible box contents
  // read through row 1 of columns H to end to get all the content types
  const contentTypes: string[] = XLSX.utils.sheet_to_json(boxDetails, { header: 1, range: "H1:ZZ1" })[0];
  console.log(contentTypes);

  // parse the content types
  const parsedContentTypes = parseContentTypes(contentTypes);

  // grab each row after the first row
  const rows = XLSX.utils.sheet_to_json(boxDetails, { header: 1, range: 1 });

  for (const row of rows) {

    // read all the box contents
    const boxContents = {};
    for (let i = 7; i < row.length; i++) {
      // if there's nothing in this cell, skip it
      if (row[i] === undefined || row[i] === 0) continue;

      // make sure this is actually items in the box and not a data point
      const type = contentTypes[i - 7];
      if (type == undefined || type?.includes("Entry_") || type?.includes("Total")) continue;

      // write to the box contents
      const quantity = row[i];
      boxContents[type] = quantity;
    }

    // create the box object
    const box: Box = {
      id: row[0],
      location: row[4],
      name: `${row[5]} ${row[6]}`,
      date: row[1],
      contents: boxContents
    };

    // add the box to the array
    boxes.push(box);
  }

  return {
    boxes,
    contentTypes: parsedContentTypes,
    locations: parseLocations(Array.from(boxes, box => box.location))
  };

}