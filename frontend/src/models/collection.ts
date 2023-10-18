export default interface Collection {
  id: string;
  name: string;
  entry_identifiers: string[];
  project_id: string;
  entries: Entry[];
  columns: string[];
}

export interface Entry {
  id: string;
  contents: { [key: string]: string };
  collection_id: string;
}

// This is temporarily deprecated
// export function deriveColumns(collection: Collection) {
//   // Retrieve columns
//   const allKeys = collection.entries.flatMap((entry) =>
//     Object.keys(JSON.parse(entry.contents))
//   );
//   const distinctColumns = new Set(allKeys);

//   // Quick check to ensure that the columns in entry_identifiers is also in the distinct columns
//   const identifiers = [...new Set(collection.entry_identifiers)];

//   // Set the identifiers to be the first N columns
//   const nonIdentifiers = [];
//   for (const column of distinctColumns) {
//     if (identifiers.includes(column)) continue;
//     nonIdentifiers.push(column);
//   }

//   // Remaining columns are ordered alphabetically
//   const orderedColumns = identifiers.sort().concat(nonIdentifiers.sort());
//   return orderedColumns;
// }
